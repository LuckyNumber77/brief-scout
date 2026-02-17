// Transfer news card

'use client';

import React from 'react';
import { Card } from './ui/Card';
import { TransferNews } from '@/lib/types';

interface TransferNewsCardProps {
  news: TransferNews[];
}

export function TransferNewsCard({ news }: TransferNewsCardProps) {
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-4">Recent Transfer News</h3>

      <div className="space-y-3">
        {news.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-accent/5 rounded-lg border border-accent/20 hover:border-accent/40 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm leading-snug mb-1 line-clamp-2">
                  {item.headline}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span className="text-accent">{item.source}</span>
                </div>
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-accent hover:text-accent/80 transition-colors"
                  aria-label="Read full article"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
