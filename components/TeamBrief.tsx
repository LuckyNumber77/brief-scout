'use client';

// Container for team brief display

import React, { useState, useEffect } from 'react';
import { TeamBriefResponse } from '@/lib/types';
import { clientCache } from '@/lib/clientCache';
import { NextMatchCard } from './NextMatchCard';
import { PlayerToWatchCard } from './PlayerToWatchCard';
import { MatchupNotesCard } from './MatchupNotesCard';
import { TransferHistoryCard } from './TransferHistoryCard';
import { TransferNewsCard } from './TransferNewsCard';

interface TeamBriefProps {
  teamId: string;
}

export function TeamBrief({ teamId }: TeamBriefProps) {
  const [brief, setBrief] = useState<TeamBriefResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrief = async () => {
      // Check client cache first
      const cacheKey = `brief:${teamId}`;
      const cached = clientCache.get<TeamBriefResponse>(cacheKey);
      
      if (cached) {
        setBrief(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/team-brief?team_id=${teamId}`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch team brief');
        }

        const data: TeamBriefResponse = await response.json();
        setBrief(data);

        // Cache for 1 hour
        clientCache.set(cacheKey, data, 60 * 60 * 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load team brief');
        console.error('Brief error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrief();
  }, [teamId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-card bg-opacity-50 backdrop-blur-xl rounded-xl animate-pulse"></div>
        <div className="h-96 bg-card bg-opacity-50 backdrop-blur-xl rounded-xl animate-pulse"></div>
        <div className="h-48 bg-card bg-opacity-50 backdrop-blur-xl rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!brief) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={brief.team.logo}
            alt={brief.team.name}
            className="w-16 h-16 object-contain"
          />
          <h2 className="text-3xl font-bold text-white">{brief.team.name}</h2>
        </div>
        <div className="text-sm text-gray-400">
          {brief.metadata.dataFreshness === 'Cached' && '📦 Cached Data'}
        </div>
      </div>

      <NextMatchCard
        fixture={brief.nextFixture}
        teamForm={brief.teamForm}
      />

      <PlayerToWatchCard 
        playerData={brief.playerToWatch}
        transferData={brief.transferData}
      />

      {brief.transferData?.transferHistory && brief.transferData.transferHistory.length > 0 && (
        <TransferHistoryCard transfers={brief.transferData.transferHistory} />
      )}

      <MatchupNotesCard
        notes={brief.matchupNotes}
        cachedAt={brief.metadata.cachedAt}
      />

      {brief.transferData?.recentNews && brief.transferData.recentNews.length > 0 && (
        <TransferNewsCard news={brief.transferData.recentNews} />
      )}
    </div>
  );
}
