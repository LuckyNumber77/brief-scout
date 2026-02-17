import OpenAI from 'openai';
import { serverCache } from './cache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface AIPromptData {
  teamName: string;
  opponent: string;
  teamForm: string;
  playerName: string;
  playerPosition: string;
  playerStats: {
    goals: number;
    assists: number;
    shotsOnTarget: number;
    minutesPlayed: number;
  };
}

export async function generateAIAnalysis(data: AIPromptData, teamId: string, fixtureId: string): Promise<{
  matchupNotes: string;
  playerReasoning: string;
}> {
  const cacheKey = `ai:${teamId}:${fixtureId}`;
  
  // Check cache first
  const cached = serverCache.get<{ matchupNotes: string; playerReasoning: string }>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const systemPrompt = `You are a professional football analyst. Provide concise, stat-driven insights. Never predict match outcomes. Cite 2-3 specific stats in your analysis.`;

    const matchupPrompt = `Analyze ${data.teamName} vs ${data.opponent}. Recent form: ${data.teamForm}. Provide matchup notes in max 80 words. Focus on team form patterns and key factors.`;

    const playerPrompt = `Why is ${data.playerName} (${data.playerPosition}) the player to watch? Stats: ${data.playerStats.goals}G, ${data.playerStats.assists}A, ${data.playerStats.shotsOnTarget} shots on target, ${data.playerStats.minutesPlayed} mins. Max 50 words.`;

    // Generate matchup notes
    const matchupResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: matchupPrompt },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    // Generate player reasoning
    const playerResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: playerPrompt },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const result = {
      matchupNotes: matchupResponse.choices[0]?.message?.content || 'Analysis unavailable',
      playerReasoning: playerResponse.choices[0]?.message?.content || 'Analysis unavailable',
    };

    // Cache for 1 hour
    serverCache.set(cacheKey, result, 3600);

    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return fallback text
    return {
      matchupNotes: `${data.teamName} faces ${data.opponent}. Recent form: ${data.teamForm}. Key match for both sides.`,
      playerReasoning: `${data.playerName} shows strong form with ${data.playerStats.goals} goals and ${data.playerStats.assists} assists in recent matches.`,
    };
  }
}
