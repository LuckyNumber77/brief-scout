// Utility functions for transfer data transformation

import { TransferMarketData } from './types';

interface TransfermarktPlayerData {
  playerName: string;
  marketValue: string;
  marketValueNumeric: number;
  dateOfBirth: string;
  nationality: string;
  position: string;
  currentClub: string;
  transferHistory: {
    season: string;
    date: string;
    fromClub: string;
    toClub: string;
    marketValue: string;
    fee: string;
    loan: boolean;
  }[];
  contractExpiry: string;
  agent: string;
  news?: {
    title: string;
    date: string;
    source: string;
  }[];
}

/**
 * Calculate years remaining on a contract
 */
export function calculateYearsRemaining(contractExpiry: string | Date): number {
  const expiryDate = new Date(contractExpiry);
  const now = new Date();
  const yearsRemaining = Math.max(0, (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365));
  return Math.round(yearsRemaining * 10) / 10;
}

/**
 * Transform Transfermarkt API data to our TransferMarketData format
 */
export function transformTransfermarktData(playerData: TransfermarktPlayerData): TransferMarketData {
  // Transform transfer history
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

  const yearsRemaining = calculateYearsRemaining(playerData.contractExpiry);

  return {
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
      yearsRemaining,
    },
    recentNews: playerData.news?.slice(0, 5).map(item => ({
      headline: item.title,
      date: item.date,
      source: item.source,
      url: undefined,
    })) || [],
  };
}
