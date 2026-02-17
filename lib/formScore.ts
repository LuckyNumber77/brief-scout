// FormScore calculation logic for player selection

import { PlayerStats, Player, FormScoreResult } from './types';

export interface PlayerWithStats {
  player: Player;
  stats: PlayerStats;
  last5Minutes: number[]; // Minutes played in last 5 matches
}

export function calculateFormScore(
  stats: PlayerStats,
  last5Minutes: number[]
): number {
  let score = 0;

  // Base stats scoring
  score += stats.goals * 4;
  score += stats.assists * 3;
  score += stats.shotsOnTarget * 2;
  score += stats.keyPasses * 1;

  // Minutes consistency bonus
  const gamesOver70 = last5Minutes.filter(mins => mins >= 70).length;

  if (gamesOver70 >= 4) {
    score += 3;
  } else {
    const gamesOver60 = last5Minutes.filter(mins => mins >= 60).length;
    if (gamesOver60 >= 3) {
      score += 1;
    }
  }

  return score;
}

export function selectPlayerToWatch(
  players: PlayerWithStats[]
): FormScoreResult | null {
  if (players.length === 0) return null;

  // Calculate form score for each player
  const scoredPlayers = players.map(p => ({
    ...p,
    formScore: calculateFormScore(p.stats, p.last5Minutes),
  }));

  // Find player with highest form score
  scoredPlayers.sort((a, b) => b.formScore - a.formScore);
  const topPlayer = scoredPlayers[0];

  // Determine confidence based on data completeness
  let confidence: "High" | "Medium" | "Low" = "Low";
  
  if (topPlayer.stats.gamesPlayed >= 5 && topPlayer.formScore > 10) {
    confidence = "High";
  } else if (topPlayer.stats.gamesPlayed >= 3 && topPlayer.formScore > 5) {
    confidence = "Medium";
  }

  return {
    player: topPlayer.player,
    stats: topPlayer.stats,
    formScore: topPlayer.formScore,
    confidence,
  };
}
