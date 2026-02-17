import axios, { AxiosInstance } from 'axios';
import { apiMonitor } from '../apiMonitor';

export class SportsAPIProClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SPORTSAPIPRO_API_KEY || '';
    this.client = axios.create({
      baseURL: 'https://v1.football.sportsapipro.com',
      headers: {
        'x-api-key': this.apiKey,
      },
    });
  }

  async searchTeams(query: string): Promise<any> {
    try {
      apiMonitor.track('sportsapipro');
      const response = await this.client.get('/teams', {
        params: { search: query },
      });
      return response.data;
    } catch (error) {
      console.error('SportsAPIPro search teams error:', error);
      throw error;
    }
  }

  async getTeamFixtures(teamId: string): Promise<any> {
    try {
      apiMonitor.track('sportsapipro');
      const response = await this.client.get(`/teams/${teamId}/fixtures`);
      return response.data;
    } catch (error) {
      console.error('SportsAPIPro get team fixtures error:', error);
      throw error;
    }
  }

  async getTeamStats(teamId: string): Promise<any> {
    try {
      apiMonitor.track('sportsapipro');
      const response = await this.client.get(`/teams/${teamId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('SportsAPIPro get team stats error:', error);
      throw error;
    }
  }
}

export const sportsAPIProClient = new SportsAPIProClient();
