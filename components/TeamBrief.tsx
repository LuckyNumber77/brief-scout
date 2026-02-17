'use client';

import React from 'react';
import Image from 'next/image';
import { TeamBriefResponse } from '@/lib/types';
import { NextMatchCard } from './NextMatchCard';
import { PlayerToWatchCard } from './PlayerToWatchCard';
import { MatchupNotesCard } from './MatchupNotesCard';

interface TeamBriefProps {
  data: TeamBriefResponse | null;
  loading: boolean;
  error: string | null;
}

export function TeamBrief({ data, loading, error }: TeamBriefProps) {
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card bg-opacity-50 backdrop-blur-xl border border-border rounded-lg p-6 animate-pulse"
          >
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-red-900 bg-opacity-50 backdrop-blur-xl border border-red-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-300 mb-2">Error</h3>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        {data.team.logo && (
          <div className="relative w-16 h-16">
            <Image
              src={data.team.logo}
              alt={data.team.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-white">{data.team.name}</h1>
      </div>

      <NextMatchCard
        data={data.nextFixture}
        teamForm={data.teamForm}
        teamName={data.team.name}
      />

      <PlayerToWatchCard data={data.playerToWatch} />

      <MatchupNotesCard
        notes={data.matchupNotes}
        dataFreshness={data.metadata.dataFreshness}
      />

      <div className="text-sm text-gray-500 text-center">
        Last updated: {new Date(data.metadata.cachedAt).toLocaleString()} • 
        API calls: {data.metadata.apiCallsMade}
      </div>
    </div>
  );
}
