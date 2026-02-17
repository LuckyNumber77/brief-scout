// OpenAI client for AI-generated summaries

import OpenAI from 'openai';
import { cache } from './cache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface AIPromptData {
  teamName: string;
  opponentName: string;
  teamForm: string;
  playerName: string;
  playerPosition: string;
  goals: number;
  assists: number;
  shotsOnTarget: number;
  minutesPlayed: number;
  gamesPlayed: number;
}

// Cache AI responses for 1 hour per team/fixture combination
const AI_CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function generateMatchupNotes(data: AIPromptData): Promise<string> {
  const cacheKey = `ai:matchup:${data.teamName}:${data.opponentName}`;
  
  // Check cache first
  const cached = cache.get<string>(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `You are a professional football analyst. Provide a brief matchup analysis (max 80 words).

Team: ${data.teamName}
Opponent: ${data.opponentName}
Recent Form (last 5): ${data.teamForm}

Focus on:
- Current form analysis (cite specific W/D/L pattern)
- Key tactical considerations
- What to watch for in the match

Be concise, professional, and stat-driven. NO match predictions.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional football analyst providing stat-driven insights. Keep responses under 80 words. Never predict match outcomes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const notes = completion.choices[0]?.message?.content || 'Analysis unavailable.';
    
    // Cache the result
    cache.set(cacheKey, notes, AI_CACHE_TTL);
    
    return notes;
  } catch (error) {
    console.error('OpenAI matchup notes error:', error);
    return 'Match analysis temporarily unavailable. Please try again later.';
  }
}

export async function generatePlayerReasoning(data: AIPromptData): Promise<string> {
  const cacheKey = `ai:player:${data.playerName}:${data.teamName}`;
  
  // Check cache first
  const cached = cache.get<string>(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `Explain why ${data.playerName} (${data.playerPosition}) is the player to watch (max 50 words).

Recent stats (last 5 games):
- Goals: ${data.goals}
- Assists: ${data.assists}
- Shots on Target: ${data.shotsOnTarget}
- Minutes: ${data.minutesPlayed} (${data.gamesPlayed} games)

Cite 2-3 specific stats. Professional, concise tone.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a football analyst. Explain player form in under 50 words using specific stats. Be factual and stat-driven.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const reasoning = completion.choices[0]?.message?.content || 'Analysis unavailable.';
    
    // Cache the result
    cache.set(cacheKey, reasoning, AI_CACHE_TTL);
    
    return reasoning;
  } catch (error) {
    console.error('OpenAI player reasoning error:', error);
    return 'Player analysis temporarily unavailable.';
  }
}
