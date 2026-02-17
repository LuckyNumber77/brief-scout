// API-Football client

import axios, { AxiosError } from 'axios';
import { apiMonitor } from '../apiMonitor';

const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY || '';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
  },
  timeout: 10000,
});

export interface APIFootballTeam {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  venue: {
    name: string;
    city: string;
  };
}

export interface APIFootballFixture {
  fixture: {
    id: number;
    date: string;
    venue: {
      name: string;
      city: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
}

export interface APIFootballPlayerStats {
  player: {
    id: number;
    name: string;
    photo: string;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
    };
    games: {
      position: string;
      number: number;
      minutes: number;
      appearences?: number;
    };
    goals: {
      total: number | null;
    };
    assists: {
      total: number | null;
    };
    shots: {
      on: number | null;
    };
    passes: {
      key: number | null;
    };
  }>;
}

export class APIFootballClient {
  async searchTeams(query: string): Promise<APIFootballTeam[]> {
    if (apiMonitor.isAtLimit('apiFootball')) {
      throw new Error('API-Football daily limit reached');
    }

    try {
      apiMonitor.incrementAPIFootball();
      const response = await client.get('/teams', {
        params: { search: query },
      });
      return response.data.response || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('API-Football search error:', axiosError.response?.status, axiosError.message);
      }
      throw error;
    }
  }

  async getTeamFixtures(teamId: number, next: number = 1): Promise<APIFootballFixture[]> {
    if (apiMonitor.isAtLimit('apiFootball')) {
      throw new Error('API-Football daily limit reached');
    }

    try {
      apiMonitor.incrementAPIFootball();
      const response = await client.get('/fixtures', {
        params: {
          team: teamId,
          next,
        },
      });
      return response.data.response || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('API-Football fixtures error:', axiosError.response?.status, axiosError.message);
      }
      throw error;
    }
  }

  async getTeamLastFixtures(teamId: number, last: number = 5): Promise<APIFootballFixture[]> {
    if (apiMonitor.isAtLimit('apiFootball')) {
      throw new Error('API-Football daily limit reached');
    }

    try {
      apiMonitor.incrementAPIFootball();
      const response = await client.get('/fixtures', {
        params: {
          team: teamId,
          last,
        },
      });
      return response.data.response || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('API-Football last fixtures error:', axiosError.response?.status, axiosError.message);
      }
      throw error;
    }
  }

  async getPlayersStats(teamId: number, season: number = 2024): Promise<APIFootballPlayerStats[]> {
    if (apiMonitor.isAtLimit('apiFootball')) {
      throw new Error('API-Football daily limit reached');
    }

    try {
      apiMonitor.incrementAPIFootball();
      const response = await client.get('/players', {
        params: {
          team: teamId,
          season,
        },
      });
      return response.data.response || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('API-Football players stats error:', axiosError.response?.status, axiosError.message);
      }
      throw error;
    }
  }
}

export const apiFootballClient = new APIFootballClient();
