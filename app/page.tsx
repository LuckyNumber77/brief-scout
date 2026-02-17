'use client';

import React, { useState } from 'react';
import { TeamSearch } from '@/components/TeamSearch';
import { TeamBrief } from '@/components/TeamBrief';
import { TeamBriefResponse } from '@/lib/types';
import { clientCache } from '@/lib/clientCache';

export default function Home() {
  const [briefData, setBriefData] = useState<TeamBriefResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTeamSelect = async (teamId: string) => {
    setError(null);
    
    // Check client cache first
    const cacheKey = `brief:${teamId}`;
    const cached = clientCache.get<TeamBriefResponse>(cacheKey);
    
    if (cached) {
      setBriefData(cached);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/team-brief?team_id=${teamId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch team brief');
      }

      const data = await response.json();
      setBriefData(data);
      
      // Cache for 1 hour
      clientCache.set(cacheKey, data, 3600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBriefData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Brief Scout
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            AI-Powered Football Player Scouting
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Search for a team to get AI-powered insights on their next match and player to watch
          </p>
          
          <TeamSearch onTeamSelect={handleTeamSelect} />
        </div>

        {/* Team Brief Section */}
        <div className="mt-12">
          <TeamBrief data={briefData} loading={loading} error={error} />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Powered by SportsAPIPro, API-Football, and OpenAI</p>
          <p className="mt-2">Data updates every hour • Cached for performance</p>
        </footer>
      </div>
    </main>
  );
}
