import React from 'react';
import { Card } from './ui/Card';
import { TeamBriefResponse } from '@/lib/types';

interface NextMatchCardProps {
  data: TeamBriefResponse['nextFixture'];
  teamForm: TeamBriefResponse['teamForm'];
  teamName: string;
}

export function NextMatchCard({ data, teamForm, teamName }: NextMatchCardProps) {
  const renderFormBadge = (result: string) => {
    const colors = {
      W: 'bg-success',
      D: 'bg-warning',
      L: 'bg-red-500',
    };
    
    return (
      <span
        className={`inline-block w-8 h-8 rounded ${colors[result as keyof typeof colors] || 'bg-gray-500'} text-white text-xs font-bold flex items-center justify-center`}
      >
        {result}
      </span>
    );
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-4">Next Match</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xl text-white font-semibold">{data.home}</div>
          <div className="text-gray-400 text-sm">VS</div>
          <div className="text-xl text-white font-semibold">{data.away}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Date:</span>
            <span className="text-white ml-2">{data.date}</span>
          </div>
          <div>
            <span className="text-gray-400">Time:</span>
            <span className="text-white ml-2">{data.time}</span>
          </div>
          <div>
            <span className="text-gray-400">Venue:</span>
            <span className="text-white ml-2">{data.venue}</span>
          </div>
          <div>
            <span className="text-gray-400">Competition:</span>
            <span className="text-white ml-2">{data.competition}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-lg font-semibold text-white mb-3">{teamName} Form (Last 5)</h3>
          <div className="flex items-center space-x-2">
            {teamForm.last5.split('-').map((result, index) => (
              <React.Fragment key={index}>
                {renderFormBadge(result)}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-400">
            Goals For: <span className="text-success font-semibold">{teamForm.goalsFor}</span>
            {' | '}
            Goals Against: <span className="text-red-400 font-semibold">{teamForm.goalsAgainst}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
