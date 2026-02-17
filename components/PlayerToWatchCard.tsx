// Player to watch card

import React from 'react';
import { Card } from './ui/Card';
import { StatBadge } from './ui/StatBadge';
import { ConfidenceBadge } from './ui/ConfidenceBadge';
import { TeamBriefResponse } from '@/lib/types';

interface PlayerToWatchCardProps {
  playerData: TeamBriefResponse['playerToWatch'];
}

export function PlayerToWatchCard({ playerData }: PlayerToWatchCardProps) {
  const { player, stats, formScore, aiReasoning, confidence } = playerData;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Player to Watch</h3>
        <ConfidenceBadge level={confidence} />
      </div>

      <div className="flex items-start gap-6 mb-6">
        <img
          src={player.photo}
          alt={player.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-accent"
        />
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-white">{player.name}</h4>
          <div className="text-accent font-medium">
            #{player.number} • {player.position}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            FormScore: <span className="text-accent font-bold">{formScore}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatBadge label="Goals" value={stats.goals} />
        <StatBadge label="Assists" value={stats.assists} />
        <StatBadge label="Shots on Target" value={stats.shotsOnTarget} />
        <StatBadge label="Minutes" value={stats.minutesPlayed} />
      </div>

      <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
        <div className="text-xs text-accent font-semibold uppercase tracking-wide mb-2">
          AI Analysis
        </div>
        <p className="text-white text-sm leading-relaxed">{aiReasoning}</p>
      </div>
    </Card>
  );
}
