// SportsAPIPro API client

import axios, { AxiosError } from 'axios';
import { apiMonitor } from '../apiMonitor';

const BASE_URL = 'https://v1.football.sportsapipro.com';
const API_KEY = process.env.SPORTSAPIPRO_API_KEY || '';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
  timeout: 10000,
});

export interface SportsAPIProTeam {
  id: string;
  name: string;
  logo: string;
  country: string;
}

export interface SportsAPIProFixture {
  id: string;
  date: string;
  time: string;
  venue: string;
  homeTeam: {
    id: string;
    name: string;
  };
  awayTeam: {
    id: string;
    name: string;
  };
  competition: string;
}

export class SportsAPIProClient {
  async searchTeams(query: string): Promise<SportsAPIProTeam[]> {
    if (apiMonitor.isAtLimit('sportsapipro')) {
      throw new Error('SportsAPIPro daily limit reached');
    }

    try {
      apiMonitor.incrementSportsAPIPro();
      const response = await client.get('/api/v1/teams/search', {
        params: { q: query },
      });
      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('SportsAPIPro search error:', axiosError.response?.status, axiosError.message);
      }
      throw error;
    }
  }

  async getTeamFixtures(teamId: string): Promise<SportsAPIProFixture[]> {
    if (apiMonitor.isAtLimit('sportsapipro')) {
      throw new Error('SportsAPIPro daily limit reached');
    }

    try {
      apiMonitor.incrementSportsAPIPro();
      const response = await client.get(`/api/v1/teams/${teamId}/fixtures`);
      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('SportsAPIPro fixtures error:', axiosError.response?.status, axiosError.message);
      }
      throw error;
    }
  }

  async getTeamForm(teamId: string): Promise<string[]> {
    if (apiMonitor.isAtLimit('sportsapipro')) {
      throw new Error('SportsAPIPro daily limit reached');
    }

    try {
      apiMonitor.incrementSportsAPIPro();
      const response = await client.get(`/api/v1/teams/${teamId}/form`);
      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('SportsAPIPro form error:', axiosError.response?.status, axiosError.message);
      }
      throw error;
    }
  }
}

export const sportsAPIProClient = new SportsAPIProClient();
