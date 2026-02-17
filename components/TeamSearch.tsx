'use client';

// Team search component with debounced autocomplete

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { TeamSearchResult } from '@/lib/types';
import { clientCache } from '@/lib/clientCache';

interface TeamSearchProps {
  onTeamSelect: (teamId: string) => void;
}

export function TeamSearch({ onTeamSelect }: TeamSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 600);
  const [results, setResults] = useState<TeamSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const searchTeams = async () => {
      // Check client cache first
      const cacheKey = `search:${debouncedQuery.toLowerCase()}`;
      const cached = clientCache.get<TeamSearchResult[]>(cacheKey);
      
      if (cached) {
        setResults(cached);
        setShowDropdown(true);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/team-search?q=${encodeURIComponent(debouncedQuery)}`);
        
        if (!response.ok) {
          throw new Error('Failed to search teams');
        }

        const data = await response.json();
        setResults(data.results || []);
        setShowDropdown(true);

        // Cache results for 10 minutes
        clientCache.set(cacheKey, data.results || [], 10 * 60 * 1000);
      } catch (err) {
        setError('Failed to search teams. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchTeams();
  }, [debouncedQuery]);

  const handleSelect = (teamId: string) => {
    setShowDropdown(false);
    setQuery('');
    onTeamSelect(teamId);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a team (min 3 characters)..."
          className="w-full px-6 py-4 bg-card border border-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-all duration-300"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-400 text-sm">{error}</div>
      )}

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
          {results.map((team) => (
            <button
              key={team.team_id}
              onClick={() => handleSelect(team.team_id)}
              className="w-full px-6 py-4 flex items-center gap-4 hover:bg-accent/10 transition-all duration-200 text-left"
            >
              {team.logo && (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-10 h-10 object-contain"
                />
              )}
              <div>
                <div className="text-white font-medium">{team.name}</div>
                <div className="text-sm text-gray-400">
                  {team.country} {team.league !== 'N/A' && `• ${team.league}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && !loading && debouncedQuery.length >= 3 && (
        <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl p-4 text-gray-400 text-center">
          No teams found
        </div>
      )}
    </div>
  );
}
