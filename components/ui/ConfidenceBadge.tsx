// Confidence level indicator

import React from 'react';

interface ConfidenceBadgeProps {
  level: 'High' | 'Medium' | 'Low';
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const colors = {
    High: 'bg-success/20 text-success border-success',
    Medium: 'bg-warning/20 text-warning border-warning',
    Low: 'bg-gray-500/20 text-gray-400 border-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors[level]}`}
    >
      {level} Confidence
    </span>
  );
}
