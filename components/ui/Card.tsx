// Glassmorphism Card component

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-card bg-opacity-50 backdrop-blur-xl border border-border rounded-xl p-6 transition-all duration-300 hover:border-accent/50 ${className}`}
    >
      {children}
    </div>
  );
}
