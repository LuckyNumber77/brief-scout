// Transfer value badge with trend indicator

import React from 'react';

interface TransferValueBadgeProps {
  value: string; // "€180.00m"
  trend?: "stable" | "rising" | "falling";
  lastUpdated?: string;
}

export function TransferValueBadge({ value, trend, lastUpdated }: TransferValueBadgeProps) {
  const trendIcon = {
    rising: '↑',
    stable: '→',
    falling: '↓',
  };

  const trendColor = {
    rising: 'text-success',
    stable: 'text-gray-400',
    falling: 'text-warning',
  };

  return (
    <div className="inline-flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/30">
      <span className="text-sm font-semibold text-accent">Market Value:</span>
      <span className="text-sm font-bold text-white">{value}</span>
      {trend && (
        <span className={`text-sm font-bold ${trendColor[trend]}`} title={`Trend: ${trend}`}>
          {trendIcon[trend]}
        </span>
      )}
      {lastUpdated && (
        <span className="text-xs text-gray-500 ml-1" title={`Last updated: ${lastUpdated}`}>
          ⓘ
        </span>
      )}
    </div>
  );
}
