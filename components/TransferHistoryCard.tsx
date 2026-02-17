// Transfer history card with timeline

'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { TransferHistoryItem } from '@/lib/types';

interface TransferHistoryCardProps {
  transfers: TransferHistoryItem[];
}

export function TransferHistoryCard({ transfers }: TransferHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!transfers || transfers.length === 0) {
    return null;
  }

  // Show first 3 on mobile, all on desktop when expanded
  const displayedTransfers = isExpanded ? transfers : transfers.slice(0, 3);
  const hasMore = transfers.length > 3;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Transfer History</h3>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-accent hover:text-accent/80 transition-colors md:hidden"
          >
            {isExpanded ? 'Show Less' : `Show All (${transfers.length})`}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayedTransfers.map((transfer, index) => (
          <div
            key={index}
            className="relative pl-6 pb-4 border-l-2 border-accent/30 last:border-l-0 last:pb-0"
          >
            {/* Timeline dot */}
            <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-accent border-2 border-background"></div>

            {/* Transfer details */}
            <div className="space-y-1">
              <div className="text-xs text-gray-400">{transfer.date}</div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-medium">{transfer.from}</span>
                <span className="text-accent">→</span>
                <span className="text-white font-medium">{transfer.to}</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                    transfer.type === 'Loan'
                      ? 'bg-warning/20 text-warning border border-warning/30'
                      : transfer.type === 'Loan Return'
                      ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      : 'bg-success/20 text-success border border-success/30'
                  }`}
                >
                  {transfer.type}
                </span>

                <span className="text-sm text-gray-300">
                  <span className="text-gray-500">Fee:</span> {transfer.fee}
                </span>

                {transfer.marketValueAtTime && (
                  <span className="text-sm text-gray-300">
                    <span className="text-gray-500">Market Value:</span> {transfer.marketValueAtTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="hidden md:block mt-4 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          Show All {transfers.length} Transfers
        </button>
      )}
    </Card>
  );
}
