// Transfer data API route

import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { transfermarktClient } from '@/lib/api-clients/transfermarkt';
import { transformTransfermarktData } from '@/lib/transferUtils';
import { TransferMarketData } from '@/lib/types';

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours server-side

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerName = searchParams.get('player_name');

    if (!playerName) {
      return NextResponse.json(
        { error: 'player_name parameter is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `transfer-api:${playerName.toLowerCase()}`;
    const cached = cache.get<TransferMarketData>(cacheKey);
    
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, max-age=7200', // 2 hours client-side
        },
      });
    }

    // Fetch data from Transfermarkt
    const playerData = await transfermarktClient.getPlayerData(playerName);

    if (!playerData) {
      return NextResponse.json(
        { error: 'Transfer data not available for this player' },
        { status: 404 }
      );
    }

    // Transform the data to our API format using utility function
    const response = transformTransfermarktData(playerData);

    // Cache the response
    cache.set(cacheKey, response, CACHE_TTL);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=7200', // 2 hours client-side
      },
    });
  } catch (error) {
    console.error('Transfer data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfer data' },
      { status: 500 }
    );
  }
}
