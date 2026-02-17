// Individual stat display badge

import React from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatBadge({ label, value, className = '' }: StatBadgeProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-2xl font-bold text-accent">{value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}
