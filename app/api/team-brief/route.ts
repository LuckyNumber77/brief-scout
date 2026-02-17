import { NextRequest, NextResponse } from 'next/server';
import { apiFootballClient } from '@/lib/api-clients/api-football';
import { serverCache } from '@/lib/cache';
import { TeamBriefResponse, PlayerCandidate } from '@/lib/types';
import { calculateFormScore, calculateConfidence } from '@/lib/formScore';
import { generateAIAnalysis } from '@/lib/ai';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const teamId = searchParams.get('team_id');

  if (!teamId) {
    return NextResponse.json(
      { error: 'team_id is required' },
      { status: 400 }
    );
  }

  const cacheKey = `team-brief:${teamId}`;

  // Check cache first (1 hour TTL)
  const cached = serverCache.get<TeamBriefResponse>(cacheKey);
  if (cached) {
    return NextResponse.json({
      ...cached,
      metadata: {
        ...cached.metadata,
        dataFreshness: 'Cached' as const,
      },
    });
  }

  try {
    let apiCallsMade = 0;

    // Get next fixture
    apiCallsMade++;
    const nextFixtureResponse = await apiFootballClient.getNextFixtures(teamId) as { response?: Array<unknown> };
    
    if (!nextFixtureResponse?.response || nextFixtureResponse.response.length === 0) {
      return NextResponse.json(
        { error: 'No upcoming fixtures found' },
        { status: 404 }
      );
    }

    const nextFixture = nextFixtureResponse.response[0] as Record<string, unknown>;
    const fixtureData = nextFixture.fixture as Record<string, unknown>;
    const teamsData = nextFixture.teams as Record<string, Record<string, unknown>>;
    const leagueData = nextFixture.league as Record<string, unknown>;

    // Get last 5 fixtures for team form
    apiCallsMade++;
    const last5Response = await apiFootballClient.getTeamFixtures(teamId, 5) as { response?: Array<Record<string, unknown>> };
    
    const teamForm = {
      last5: '',
      goalsFor: 0,
      goalsAgainst: 0,
    };

    if (last5Response?.response && Array.isArray(last5Response.response)) {
      const formArray: string[] = [];
      
      for (const matchRaw of last5Response.response.slice(0, 5).reverse()) {
        const match = matchRaw as {
          teams?: { home?: { id?: number | string }; away?: { id?: number | string } };
          goals?: { home?: number; away?: number };
        };
        const homeTeam = match.teams?.home;
        const isHome = homeTeam?.id?.toString() === teamId;
        const teamGoals = isHome ? match.goals?.home : match.goals?.away;
        const opponentGoals = isHome ? match.goals?.away : match.goals?.home;

        teamForm.goalsFor += teamGoals || 0;
        teamForm.goalsAgainst += opponentGoals || 0;

        if ((teamGoals || 0) > (opponentGoals || 0)) {
          formArray.push('W');
        } else if (teamGoals === opponentGoals) {
          formArray.push('D');
        } else {
          formArray.push('L');
        }
      }

      teamForm.last5 = formArray.join('-');
    }

    // Get team players with stats for current season
    const currentSeason = new Date().getFullYear();
    apiCallsMade++;
    const playersResponse = await apiFootballClient.getTeamPlayers(teamId, currentSeason) as { response?: Array<Record<string, unknown>> };

    let playerToWatch: TeamBriefResponse['playerToWatch'] | null = null;

    if (playersResponse?.response && Array.isArray(playersResponse.response)) {
      const candidates: PlayerCandidate[] = playersResponse.response
        .slice(0, 20)
        .map((item: Record<string, unknown>) => {
          const player = item.player as Record<string, unknown>;
          const statsArray = item.statistics as Array<Record<string, unknown>> | undefined;
          const stats = statsArray?.[0]; // Take first league stats

          return {
            player: {
              id: player?.id?.toString() || '',
              name: player?.name?.toString() || 'Unknown',
              position: player?.position?.toString() || 'Unknown',
              number: Number(player?.number) || 0,
              photo: player?.photo?.toString() || '',
            },
            stats: {
              goals: Number((stats?.goals as Record<string, unknown>)?.total) || 0,
              assists: Number((stats?.goals as Record<string, unknown>)?.assists) || 0,
              shotsOnTarget: Number((stats?.shots as Record<string, unknown>)?.on) || 0,
              keyPasses: Number((stats?.passes as Record<string, unknown>)?.key) || 0,
              minutesPlayed: Number((stats?.games as Record<string, unknown>)?.minutes) || 0,
              gamesPlayed: Number((stats?.games as Record<string, unknown>)?.appearances) || 0,
            },
          };
        })
        .filter((c: PlayerCandidate) => c.stats.gamesPlayed > 0);

      // Select player with highest FormScore
      let bestPlayer: PlayerCandidate | null = null;
      let highestScore = -1;

      for (const candidate of candidates) {
        const score = calculateFormScore(candidate.stats);
        if (score > highestScore) {
          highestScore = score;
          bestPlayer = candidate;
        }
      }

      if (bestPlayer) {
        const confidence = calculateConfidence(bestPlayer.stats);

        // Get AI analysis
        const homeTeam = teamsData.home as Record<string, unknown>;
        const awayTeam = teamsData.away as Record<string, unknown>;
        const teamName = homeTeam.id?.toString() === teamId 
          ? homeTeam.name?.toString() || 'Unknown'
          : awayTeam.name?.toString() || 'Unknown';
        const opponentName = homeTeam.id?.toString() === teamId 
          ? awayTeam.name?.toString() || 'Unknown'
          : homeTeam.name?.toString() || 'Unknown';

        const aiAnalysis = await generateAIAnalysis(
          {
            teamName,
            opponent: opponentName,
            teamForm: teamForm.last5,
            playerName: bestPlayer.player.name,
            playerPosition: bestPlayer.player.position,
            playerStats: {
              goals: bestPlayer.stats.goals,
              assists: bestPlayer.stats.assists,
              shotsOnTarget: bestPlayer.stats.shotsOnTarget,
              minutesPlayed: bestPlayer.stats.minutesPlayed,
            },
          },
          teamId,
          fixtureData.id?.toString() || 'unknown'
        );

        playerToWatch = {
          player: bestPlayer.player,
          stats: bestPlayer.stats,
          formScore: highestScore,
          aiReasoning: aiAnalysis.playerReasoning,
          confidence,
        };
      }
    }

    // Fallback if no player found
    if (!playerToWatch) {
      playerToWatch = {
        player: {
          id: '0',
          name: 'No player data',
          position: 'N/A',
          number: 0,
          photo: '',
        },
        stats: {
          goals: 0,
          assists: 0,
          shotsOnTarget: 0,
          keyPasses: 0,
          minutesPlayed: 0,
          gamesPlayed: 0,
        },
        formScore: 0,
        aiReasoning: 'Insufficient player data available',
        confidence: 'Low',
      };
    }

    const homeTeam = teamsData.home as Record<string, unknown>;
    const awayTeam = teamsData.away as Record<string, unknown>;
    
    const teamName = homeTeam.id?.toString() === teamId 
      ? homeTeam.name?.toString() || 'Unknown'
      : awayTeam.name?.toString() || 'Unknown';
    const teamLogo = homeTeam.id?.toString() === teamId 
      ? homeTeam.logo?.toString() || ''
      : awayTeam.logo?.toString() || '';
    const opponentName = homeTeam.id?.toString() === teamId 
      ? awayTeam.name?.toString() || 'Unknown'
      : homeTeam.name?.toString() || 'Unknown';

    let matchupNotes = '';
    
    if (playerToWatch.player.id !== '0') {
      const aiAnalysis = await generateAIAnalysis(
        {
          teamName,
          opponent: opponentName,
          teamForm: teamForm.last5,
          playerName: playerToWatch.player.name,
          playerPosition: playerToWatch.player.position,
          playerStats: {
            goals: playerToWatch.stats.goals,
            assists: playerToWatch.stats.assists,
            shotsOnTarget: playerToWatch.stats.shotsOnTarget,
            minutesPlayed: playerToWatch.stats.minutesPlayed,
          },
        },
        teamId,
        fixtureData.id?.toString() || 'unknown'
      );
      matchupNotes = aiAnalysis.matchupNotes;
    } else {
      matchupNotes = `${teamName} faces ${opponentName}. Recent form: ${teamForm.last5}.`;
    }

    const briefResponse: TeamBriefResponse = {
      team: {
        id: teamId,
        name: teamName,
        logo: teamLogo,
      },
      nextFixture: {
        id: fixtureData.id?.toString() || '0',
        date: new Date(fixtureData.date as string).toLocaleDateString(),
        time: new Date(fixtureData.date as string).toLocaleTimeString(),
        venue: ((fixtureData.venue as Record<string, unknown>)?.name as string) || 'TBD',
        home: homeTeam.name?.toString() || 'Unknown',
        away: awayTeam.name?.toString() || 'Unknown',
        competition: leagueData.name?.toString() || 'Unknown',
      },
      teamForm,
      playerToWatch,
      matchupNotes,
      metadata: {
        cachedAt: new Date().toISOString(),
        dataFreshness: 'Live',
        apiCallsMade,
      },
    };

    // Cache for 1 hour
    serverCache.set(cacheKey, briefResponse, 3600);

    return NextResponse.json(briefResponse);
  } catch (error) {
    console.error('Team brief error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team brief' },
      { status: 500 }
    );
  }
}
