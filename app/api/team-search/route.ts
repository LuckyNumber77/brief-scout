// Team search API route

import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { sportsAPIProClient } from '@/lib/api-clients/sportsapipro';
import { apiFootballClient } from '@/lib/api-clients/api-football';
import { TeamSearchResult } from '@/lib/types';

const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `team-search:${query.toLowerCase()}`;
    const cached = cache.get<TeamSearchResult[]>(cacheKey);
    
    if (cached) {
      return NextResponse.json({
        results: cached,
        cached: true,
      });
    }

    let results: TeamSearchResult[] = [];

    // Try SportsAPIPro first
    try {
      const teams = await sportsAPIProClient.searchTeams(query);
      results = teams.map(team => ({
        team_id: team.id,
        name: team.name,
        logo: team.logo,
        league: 'N/A',
        country: team.country,
      }));
    } catch (error) {
      console.error('SportsAPIPro search failed, trying API-Football:', error);
      
      // Fallback to API-Football
      try {
        const teams = await apiFootballClient.searchTeams(query);
        results = teams.map(team => ({
          team_id: team.team.id.toString(),
          name: team.team.name,
          logo: team.team.logo,
          league: 'N/A',
          country: team.venue.city || 'N/A',
        }));
      } catch (fallbackError) {
        console.error('Both APIs failed:', fallbackError);
        return NextResponse.json(
          { error: 'Failed to search teams. Please try again later.' },
          { status: 503 }
        );
      }
    }

    // Cache the results
    cache.set(cacheKey, results, CACHE_TTL);

    return NextResponse.json({
      results,
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
