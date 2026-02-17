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
    const nextFixtureResponse = await apiFootballClient.getNextFixtures(teamId);
    
    if (!nextFixtureResponse?.response || nextFixtureResponse.response.length === 0) {
      return NextResponse.json(
        { error: 'No upcoming fixtures found' },
        { status: 404 }
      );
    }

    const nextFixture = nextFixtureResponse.response[0];
    const fixtureData = nextFixture.fixture;
    const teamsData = nextFixture.teams;
    const leagueData = nextFixture.league;

    // Get last 5 fixtures for team form
    apiCallsMade++;
    const last5Response = await apiFootballClient.getTeamFixtures(teamId, 5);
    
    let teamForm = {
      last5: '',
      goalsFor: 0,
      goalsAgainst: 0,
    };

    if (last5Response?.response && Array.isArray(last5Response.response)) {
      const formArray: string[] = [];
      
      for (const match of last5Response.response.slice(0, 5).reverse()) {
        const homeTeam = match.teams?.home;
        const awayTeam = match.teams?.away;
        const isHome = homeTeam?.id?.toString() === teamId;
        const teamGoals = isHome ? match.goals?.home : match.goals?.away;
        const opponentGoals = isHome ? match.goals?.away : match.goals?.home;

        teamForm.goalsFor += teamGoals || 0;
        teamForm.goalsAgainst += opponentGoals || 0;

        if (teamGoals > opponentGoals) {
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
    const playersResponse = await apiFootballClient.getTeamPlayers(teamId, currentSeason);

    let playerToWatch: TeamBriefResponse['playerToWatch'] | null = null;

    if (playersResponse?.response && Array.isArray(playersResponse.response)) {
      const candidates: PlayerCandidate[] = playersResponse.response
        .slice(0, 20)
        .map((item: any) => {
          const player = item.player;
          const stats = item.statistics?.[0]; // Take first league stats

          return {
            player: {
              id: player?.id?.toString() || '',
              name: player?.name || 'Unknown',
              position: player?.position || 'Unknown',
              number: player?.number || 0,
              photo: player?.photo || '',
            },
            stats: {
              goals: stats?.goals?.total || 0,
              assists: stats?.goals?.assists || 0,
              shotsOnTarget: stats?.shots?.on || 0,
              keyPasses: stats?.passes?.key || 0,
              minutesPlayed: stats?.games?.minutes || 0,
              gamesPlayed: stats?.games?.appearences || 0,
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
        const teamName = teamsData.home.id.toString() === teamId 
          ? teamsData.home.name 
          : teamsData.away.name;
        const opponentName = teamsData.home.id.toString() === teamId 
          ? teamsData.away.name 
          : teamsData.home.name;

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
          fixtureData.id.toString()
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

    const teamName = teamsData.home.id.toString() === teamId 
      ? teamsData.home.name 
      : teamsData.away.name;
    const teamLogo = teamsData.home.id.toString() === teamId 
      ? teamsData.home.logo 
      : teamsData.away.logo;
    const opponentName = teamsData.home.id.toString() === teamId 
      ? teamsData.away.name 
      : teamsData.home.name;

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
        fixtureData.id.toString()
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
        id: fixtureData.id.toString(),
        date: new Date(fixtureData.date).toLocaleDateString(),
        time: new Date(fixtureData.date).toLocaleTimeString(),
        venue: fixtureData.venue?.name || 'TBD',
        home: teamsData.home.name,
        away: teamsData.away.name,
        competition: leagueData.name,
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
