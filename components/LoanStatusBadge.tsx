// Loan status badge

import React from 'react';
import { LoanStatus } from '@/lib/types';

interface LoanStatusBadgeProps {
  loanStatus: LoanStatus;
}

export function LoanStatusBadge({ loanStatus }: LoanStatusBadgeProps) {
  if (!loanStatus.isOnLoan) {
    return null;
  }

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mt-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-warning text-sm font-bold">⚠️ ON LOAN</span>
      </div>
      <div className="text-xs text-gray-300 space-y-1">
        {loanStatus.loanedFrom && (
          <div>
            <span className="text-gray-500">From:</span>{' '}
            <span className="text-white font-medium">{loanStatus.loanedFrom}</span>
          </div>
        )}
        {loanStatus.loanedTo && (
          <div>
            <span className="text-gray-500">To:</span>{' '}
            <span className="text-white font-medium">{loanStatus.loanedTo}</span>
          </div>
        )}
        {loanStatus.loanEnd && (
          <div>
            <span className="text-gray-500">Loan ends:</span>{' '}
            <span className="text-white font-medium">{loanStatus.loanEnd}</span>
          </div>
        )}
        {loanStatus.buyOption && (
          <div className="mt-2 pt-2 border-t border-warning/30">
            <span className="text-warning font-semibold">💰 {loanStatus.buyOption}</span>
          </div>
        )}
      </div>
    </div>
  );
}
