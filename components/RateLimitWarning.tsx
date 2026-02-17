'use client';

// Rate limit warning component

import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';

export function RateLimitWarning() {
  const [showWarning, setShowWarning] = useState(false);
  
  // This would typically check actual API usage
  // For now, we'll show it as an informational component
  
  return showWarning ? (
    <Card className="bg-warning/10 border-warning/50">
      <div className="flex items-start gap-4">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h4 className="text-warning font-bold mb-2">Approaching API Limits</h4>
          <p className="text-white text-sm mb-3">
            We&apos;re getting close to the daily API request limit. Don&apos;t worry - your recent
            searches are cached and will load instantly!
          </p>
          <div className="text-xs text-gray-400">
            Cached data remains fresh for up to 1 hour
          </div>
        </div>
      </div>
    </Card>
  ) : null;
}
