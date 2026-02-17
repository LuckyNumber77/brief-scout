import axios, { AxiosInstance } from 'axios';
import { apiMonitor } from '../apiMonitor';

export class APIFootballClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.API_FOOTBALL_KEY || '';
    this.client = axios.create({
      baseURL: 'https://v3.football.api-sports.io',
      headers: {
        'x-rapidapi-key': this.apiKey,
      },
    });
  }

  async searchTeams(query: string): Promise<any> {
    try {
      apiMonitor.track('api-football');
      const response = await this.client.get('/teams', {
        params: { search: query },
      });
      return response.data;
    } catch (error) {
      console.error('API-Football search teams error:', error);
      throw error;
    }
  }

  async getTeamFixtures(teamId: string, last: number = 5): Promise<any> {
    try {
      apiMonitor.track('api-football');
      const response = await this.client.get('/fixtures', {
        params: { 
          team: teamId,
          last: last
        },
      });
      return response.data;
    } catch (error) {
      console.error('API-Football get team fixtures error:', error);
      throw error;
    }
  }

  async getNextFixtures(teamId: string): Promise<any> {
    try {
      apiMonitor.track('api-football');
      const response = await this.client.get('/fixtures', {
        params: { 
          team: teamId,
          next: 1
        },
      });
      return response.data;
    } catch (error) {
      console.error('API-Football get next fixtures error:', error);
      throw error;
    }
  }

  async getPlayerStats(playerId: string, season: number): Promise<any> {
    try {
      apiMonitor.track('api-football');
      const response = await this.client.get('/players', {
        params: { 
          id: playerId,
          season: season
        },
      });
      return response.data;
    } catch (error) {
      console.error('API-Football get player stats error:', error);
      throw error;
    }
  }

  async getTeamPlayers(teamId: string, season: number): Promise<any> {
    try {
      apiMonitor.track('api-football');
      const response = await this.client.get('/players', {
        params: { 
          team: teamId,
          season: season
        },
      });
      return response.data;
    } catch (error) {
      console.error('API-Football get team players error:', error);
      throw error;
    }
  }
}

export const apiFootballClient = new APIFootballClient();
