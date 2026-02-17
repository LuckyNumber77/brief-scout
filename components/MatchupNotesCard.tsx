import React from 'react';
import { Card } from './ui/Card';

interface MatchupNotesCardProps {
  notes: string;
  dataFreshness: 'Live' | 'Cached';
}

export function MatchupNotesCard({ notes, dataFreshness }: MatchupNotesCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Matchup Analysis</h2>
        <span
          className={`text-xs px-2 py-1 rounded ${
            dataFreshness === 'Live' ? 'bg-success text-white' : 'bg-gray-600 text-white'
          }`}
        >
          {dataFreshness}
        </span>
      </div>
      
      <p className="text-white leading-relaxed">{notes}</p>
    </Card>
  );
}
