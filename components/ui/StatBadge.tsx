import React from 'react';

interface StatBadgeProps {
  label: string;
  value: number | string;
}

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className="flex flex-col items-center p-3 bg-background bg-opacity-50 rounded-lg">
      <span className="text-2xl font-bold text-accent">{value}</span>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
    </div>
  );
}
