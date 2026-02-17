import React from 'react';
import Image from 'next/image';
import { Card } from './ui/Card';
import { StatBadge } from './ui/StatBadge';
import { ConfidenceBadge } from './ui/ConfidenceBadge';
import { TeamBriefResponse } from '@/lib/types';

interface PlayerToWatchCardProps {
  data: TeamBriefResponse['playerToWatch'];
}

export function PlayerToWatchCard({ data }: PlayerToWatchCardProps) {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-4">Player to Watch</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {data.player.photo && (
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-accent">
              <Image
                src={data.player.photo}
                alt={data.player.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{data.player.name}</h3>
            <div className="text-gray-400">
              {data.player.position} • #{data.player.number}
            </div>
            <div className="mt-2">
              <ConfidenceBadge level={data.confidence} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <StatBadge label="Goals" value={data.stats.goals} />
          <StatBadge label="Assists" value={data.stats.assists} />
          <StatBadge label="Shots OT" value={data.stats.shotsOnTarget} />
          <StatBadge label="Minutes" value={data.stats.minutesPlayed} />
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">AI Analysis</h4>
          <p className="text-white text-sm leading-relaxed">{data.aiReasoning}</p>
        </div>

        <div className="text-xs text-gray-500">
          FormScore: {data.formScore.toFixed(1)}
        </div>
      </div>
    </Card>
  );
}
