// Next match card component

import React from 'react';
import { Card } from './ui/Card';
import { TeamBriefResponse } from '@/lib/types';

interface NextMatchCardProps {
  fixture: TeamBriefResponse['nextFixture'];
  teamForm: TeamBriefResponse['teamForm'];
}

export function NextMatchCard({ fixture, teamForm }: NextMatchCardProps) {
  const formArray = teamForm.last5.split('-');
  
  const formColors: { [key: string]: string } = {
    W: 'bg-success text-white',
    D: 'bg-warning text-white',
    L: 'bg-red-500 text-white',
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-4">Next Match</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            {fixture.home} <span className="text-gray-500">vs</span> {fixture.away}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Date</div>
            <div className="text-white font-medium">{fixture.date}</div>
          </div>
          <div>
            <div className="text-gray-400">Time</div>
            <div className="text-white font-medium">{fixture.time}</div>
          </div>
          <div>
            <div className="text-gray-400">Venue</div>
            <div className="text-white font-medium">{fixture.venue}</div>
          </div>
          <div>
            <div className="text-gray-400">Competition</div>
            <div className="text-white font-medium">{fixture.competition}</div>
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-sm mb-2">Recent Form (Last 5)</div>
          <div className="flex gap-2">
            {formArray.map((result, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${formColors[result] || 'bg-gray-500'}`}
              >
                {result}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Goals: {teamForm.goalsFor} scored, {teamForm.goalsAgainst} conceded
          </div>
        </div>
      </div>
    </Card>
  );
}
