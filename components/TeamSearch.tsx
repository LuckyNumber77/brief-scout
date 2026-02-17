'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { TeamSearchResult } from '@/lib/types';
import { clientCache } from '@/lib/clientCache';

const DEBOUNCE_DELAY_MS = 600;
const SEARCH_CACHE_TTL_SECONDS = 600; // 10 minutes

interface TeamSearchProps {
  onTeamSelect: (teamId: string) => void;
}

export function TeamSearch({ onTeamSelect }: TeamSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, DEBOUNCE_DELAY_MS);
  const [results, setResults] = useState<TeamSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchTeams = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Check client cache first
    const cacheKey = `search:${searchQuery.toLowerCase()}`;
    const cached = clientCache.get<TeamSearchResult[]>(cacheKey);
    
    if (cached) {
      setResults(cached);
      setShowDropdown(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/team-search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.results) {
        setResults(data.results);
        setShowDropdown(true);
        
        // Cache for 10 minutes
        clientCache.set(cacheKey, data.results, SEARCH_CACHE_TTL_SECONDS);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    searchTeams(debouncedQuery);
  }, [debouncedQuery, searchTeams]);

  const handleTeamClick = (teamId: string) => {
    onTeamSelect(teamId);
    setShowDropdown(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        placeholder="Search for a team (min 3 characters)..."
        className="w-full px-6 py-4 bg-card border border-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-all duration-300"
      />

      {loading && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></div>
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg overflow-hidden shadow-xl">
          {results.map((team) => (
            <button
              key={team.team_id}
              onClick={() => handleTeamClick(team.team_id)}
              className="w-full px-6 py-4 text-left hover:bg-background transition-all duration-200 flex items-center space-x-4"
            >
              {team.logo && (
                <div className="relative w-10 h-10">
                  <Image
                    src={team.logo}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="text-white font-medium">{team.name}</div>
                <div className="text-sm text-gray-400">
                  {team.league} • {team.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
