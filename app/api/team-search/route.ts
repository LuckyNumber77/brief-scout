import { NextRequest, NextResponse } from 'next/server';
import { sportsAPIProClient } from '@/lib/api-clients/sportsapipro';
import { apiFootballClient } from '@/lib/api-clients/api-football';
import { serverCache } from '@/lib/cache';
import { TeamSearchResult } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 3) {
    return NextResponse.json(
      { error: 'Query must be at least 3 characters' },
      { status: 400 }
    );
  }

  const cacheKey = `team-search:${query.toLowerCase()}`;

  // Check cache first (4 hours TTL)
  const cached = serverCache.get<TeamSearchResult[]>(cacheKey);
  if (cached) {
    return NextResponse.json({
      results: cached,
      cached: true,
    });
  }

  try {
    let teams: TeamSearchResult[] = [];

    // Try SportsAPIPro first
    try {
      const response = await sportsAPIProClient.searchTeams(query);
      
      if (response && response.data && Array.isArray(response.data)) {
        teams = response.data.slice(0, 10).map((team: any) => ({
          team_id: team.id?.toString() || team.team_id?.toString(),
          name: team.name || team.team_name,
          logo: team.logo || team.team_logo || '',
          league: team.league?.name || team.league_name || 'Unknown',
          country: team.country?.name || team.country_name || 'Unknown',
        }));
      }
    } catch (sportsError) {
      console.error('SportsAPIPro failed, trying API-Football:', sportsError);

      // Fallback to API-Football
      try {
        const response = await apiFootballClient.searchTeams(query);
        
        if (response && response.response && Array.isArray(response.response)) {
          teams = response.response.slice(0, 10).map((item: any) => ({
            team_id: item.team?.id?.toString(),
            name: item.team?.name,
            logo: item.team?.logo || '',
            league: item.league?.name || 'Unknown',
            country: item.league?.country || 'Unknown',
          }));
        }
      } catch (footballError) {
        console.error('Both APIs failed:', footballError);
        return NextResponse.json(
          { error: 'Failed to fetch teams from both APIs' },
          { status: 500 }
        );
      }
    }

    // Cache the results for 4 hours
    serverCache.set(cacheKey, teams, 14400);

    return NextResponse.json({
      results: teams,
      cached: false,
    });
  } catch (error) {
    console.error('Team search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
