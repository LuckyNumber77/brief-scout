'use client';

// Main page with hero section and team search

import React, { useState } from 'react';
import { TeamSearch } from '@/components/TeamSearch';
import { TeamBrief } from '@/components/TeamBrief';
import { RateLimitWarning } from '@/components/RateLimitWarning';

export default function Home() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-4">
              Brief <span className="text-accent">Scout</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              AI-powered football scouting. Find your team&apos;s next match and discover
              the player to watch based on recent form.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <TeamSearch onTeamSelect={setSelectedTeamId} />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Results Section */}
      {selectedTeamId && (
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <RateLimitWarning />
            <TeamBrief teamId={selectedTeamId} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>
            Powered by AI • Data from SportsAPIPro & API-Football
          </p>
          <p className="mt-2 text-xs">
            All data cached for optimal performance • Daily API limits apply
          </p>
        </div>
      </footer>
    </main>
  );
}
