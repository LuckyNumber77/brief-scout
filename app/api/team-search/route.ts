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
      const response = await sportsAPIProClient.searchTeams(query) as { data?: Array<Record<string, unknown>> };
      
      if (response && response.data && Array.isArray(response.data)) {
        teams = response.data.slice(0, 10).map((team: Record<string, unknown>) => ({
          team_id: team.id?.toString() || team.team_id?.toString() || '0',
          name: (team.name || team.team_name || 'Unknown') as string,
          logo: (team.logo || team.team_logo || '') as string,
          league: ((team.league as Record<string, unknown>)?.name || (team.league_name || 'Unknown')) as string,
          country: ((team.country as Record<string, unknown>)?.name || (team.country_name || 'Unknown')) as string,
        }));
      }
    } catch (sportsError) {
      console.error('SportsAPIPro failed, trying API-Football:', sportsError);

      // Fallback to API-Football
      try {
        const response = await apiFootballClient.searchTeams(query) as { response?: Array<Record<string, unknown>> };
        
        if (response && response.response && Array.isArray(response.response)) {
          teams = response.response.slice(0, 10).map((item: Record<string, unknown>) => ({
            team_id: ((item.team as Record<string, unknown>)?.id?.toString() || '0'),
            name: ((item.team as Record<string, unknown>)?.name || 'Unknown') as string,
            logo: ((item.team as Record<string, unknown>)?.logo || '') as string,
            league: ((item.league as Record<string, unknown>)?.name || 'Unknown') as string,
            country: ((item.league as Record<string, unknown>)?.country || 'Unknown') as string,
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
