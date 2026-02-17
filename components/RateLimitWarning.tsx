import React from 'react';
import { apiMonitor } from '@/lib/apiMonitor';

export function RateLimitWarning() {
  const usage = apiMonitor.getAllUsage();
  const total = (usage['sportsapipro'] || 0) + (usage['api-football'] || 0);
  const limit = 200;
  const percentage = (total / limit) * 100;

  if (percentage < 80) {
    return null;
  }

  return (
    <div className={`w-full max-w-6xl mx-auto mb-6 p-4 rounded-lg border ${
      percentage >= 95
        ? 'bg-red-900 bg-opacity-50 border-red-700'
        : 'bg-warning bg-opacity-20 border-warning'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">
            {percentage >= 95 ? '⚠️ API Limit Nearly Reached' : '⚠️ Approaching API Limit'}
          </h3>
          <p className="text-sm text-gray-300 mt-1">
            {total} / {limit} daily API calls used ({percentage.toFixed(0)}%)
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Cached data will be used when available to conserve API calls.
          </p>
        </div>
        <div className="text-3xl">
          {percentage >= 95 ? '🚨' : '⚠️'}
        </div>
      </div>
    </div>
  );
}
