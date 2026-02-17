import { PlayerCandidate, PlayerStats } from './types';

export function calculateFormScore(stats: PlayerStats): number {
  let score = 0;

  // Goals × 4
  score += stats.goals * 4;

  // Assists × 3
  score += stats.assists * 3;

  // Shots on Target × 2
  score += stats.shotsOnTarget * 2;

  // Key Passes × 1
  score += stats.keyPasses * 1;

  // Minutes consistency bonus
  const avgMinutes = stats.minutesPlayed / stats.gamesPlayed;
  
  if (avgMinutes >= 70 && stats.gamesPlayed >= 4) {
    // +3 if played ≥70 mins in 4+ of last 5
    score += 3;
  } else if (avgMinutes >= 60 && stats.gamesPlayed >= 3) {
    // +1 if played ≥60 mins in 3+ of last 5
    score += 1;
  }

  return score;
}

export function selectPlayerToWatch(candidates: PlayerCandidate[]): PlayerCandidate | null {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  let bestPlayer: PlayerCandidate | null = null;
  let highestScore = -1;

  for (const candidate of candidates) {
    const score = calculateFormScore(candidate.stats);
    
    if (score > highestScore) {
      highestScore = score;
      bestPlayer = candidate;
    }
  }

  return bestPlayer;
}

export function calculateConfidence(stats: PlayerStats): "High" | "Medium" | "Low" {
  // High confidence: played at least 4 games with good data
  if (stats.gamesPlayed >= 4 && stats.minutesPlayed >= 270) {
    return "High";
  }

  // Medium confidence: played at least 3 games
  if (stats.gamesPlayed >= 3 && stats.minutesPlayed >= 180) {
    return "Medium";
  }

  // Low confidence: less than 3 games or limited minutes
  return "Low";
}
