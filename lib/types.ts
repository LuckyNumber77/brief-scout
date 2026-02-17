// Core TypeScript interfaces for the application

export interface TeamSearchResult {
  team_id: string;
  name: string;
  logo: string;
  league: string;
  country: string;
}

export interface TeamBriefResponse {
  team: {
    id: string;
    name: string;
    logo: string;
  };
  nextFixture: {
    id: string;
    date: string;
    time: string;
    venue: string;
    home: string;
    away: string;
    competition: string;
  };
  teamForm: {
    last5: string;
    goalsFor: number;
    goalsAgainst: number;
  };
  playerToWatch: {
    player: {
      id: string;
      name: string;
      position: string;
      number: number;
      photo: string;
    };
    stats: {
      goals: number;
      assists: number;
      shotsOnTarget: number;
      keyPasses: number;
      minutesPlayed: number;
      gamesPlayed: number;
    };
    formScore: number;
    aiReasoning: string;
    confidence: "High" | "Medium" | "Low";
  };
  matchupNotes: string;
  metadata: {
    cachedAt: string;
    dataFreshness: "Live" | "Cached";
    apiCallsMade: number;
  };
}

export interface PlayerStats {
  goals: number;
  assists: number;
  shotsOnTarget: number;
  keyPasses: number;
  minutesPlayed: number;
  gamesPlayed: number;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  photo: string;
}

export interface FormScoreResult {
  player: Player;
  stats: PlayerStats;
  formScore: number;
  confidence: "High" | "Medium" | "Low";
}
