// AI-generated matchup notes card

import React from 'react';
import { Card } from './ui/Card';

interface MatchupNotesCardProps {
  notes: string;
  cachedAt: string;
}

export function MatchupNotesCard({ notes, cachedAt }: MatchupNotesCardProps) {
  const timeAgo = getTimeAgo(cachedAt);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Matchup Analysis</h3>
        <div className="text-xs text-gray-400">Updated {timeAgo}</div>
      </div>

      <div className="bg-card/50 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🤖</div>
          <p className="text-white leading-relaxed flex-1">{notes}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        AI-powered insights • No match predictions
      </div>
    </Card>
  );
}

function getTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
