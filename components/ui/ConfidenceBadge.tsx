import React from 'react';

interface ConfidenceBadgeProps {
  level: 'High' | 'Medium' | 'Low';
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const colors = {
    High: 'bg-success text-white',
    Medium: 'bg-warning text-white',
    Low: 'bg-gray-500 text-white',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors[level]}`}
    >
      {level} Confidence
    </span>
  );
}
