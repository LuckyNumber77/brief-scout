// Transfer data API route

import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { transfermarktClient } from '@/lib/api-clients/transfermarkt';
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

    // Transform the data to our API format
    const transferHistory = playerData.transferHistory
      .slice(0, 5) // Last 5 transfers
      .map(transfer => ({
        date: transfer.date,
        from: transfer.fromClub,
        fromLogo: undefined, // Not provided by API
        to: transfer.toClub,
        toLogo: undefined, // Not provided by API
        fee: transfer.fee,
        marketValueAtTime: transfer.marketValue,
        type: transfer.loan ? ('Loan' as const) : ('Permanent' as const),
      }));

    // Check if player is currently on loan
    const currentLoan = playerData.transferHistory.find(
      t => t.loan && t.toClub === playerData.currentClub
    );

    const loanStatus = {
      isOnLoan: !!currentLoan,
      loanedFrom: currentLoan?.fromClub,
      loanedTo: currentLoan?.toClub,
      loanEnd: undefined, // Not typically in the data
      buyOption: undefined, // Not typically in the data
    };

    // Calculate years remaining on contract
    const contractExpiry = new Date(playerData.contractExpiry);
    const now = new Date();
    const yearsRemaining = Math.max(0, (contractExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365));

    // Build response
    const response: TransferMarketData = {
      marketValue: {
        current: playerData.marketValue,
        currency: 'EUR', // Transfermarkt typically uses EUR
        numeric: playerData.marketValueNumeric,
        trend: undefined, // Would need historical data to determine
      },
      transferHistory,
      loanStatus,
      contract: {
        club: playerData.currentClub,
        expires: playerData.contractExpiry,
        yearsRemaining: Math.round(yearsRemaining * 10) / 10,
      },
      recentNews: playerData.news?.slice(0, 5).map(item => ({
        headline: item.title,
        date: item.date,
        source: item.source,
        url: undefined,
      })) || [],
    };

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
