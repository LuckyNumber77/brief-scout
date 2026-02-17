// Transfermarkt API client via Apify

import axios, { AxiosError } from 'axios';
import { cache } from '../cache';

const BASE_URL = 'https://api.apify.com/v2/acts';
const ACTOR_ID = process.env.TRANSFERMARKT_ACTOR_ID || 'webdatalabs-transfermarkt-scraper';
const API_TOKEN = process.env.APIFY_API_TOKEN || '';

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

interface TransfermarktPlayerData {
  playerName: string;
  marketValue: string;
  marketValueNumeric: number;
  dateOfBirth: string;
  nationality: string;
  position: string;
  currentClub: string;
  transferHistory: {
    season: string;
    date: string;
    fromClub: string;
    toClub: string;
    marketValue: string;
    fee: string;
    loan: boolean;
  }[];
  contractExpiry: string;
  agent: string;
  news?: {
    title: string;
    date: string;
    source: string;
  }[];
}

export class TransfermarktClient {
  private getTransfermarktUrl(playerName: string): string {
    // For MVP, we'll construct a basic Transfermarkt URL
    // In production, you'd want a more robust mapping service
    const normalizedName = playerName.toLowerCase().replace(/\s+/g, '-');
    return `https://www.transfermarkt.com/${normalizedName}/profil/spieler/`;
  }

  async getPlayerData(playerName: string): Promise<TransfermarktPlayerData | null> {
    // Check cache first
    const cacheKey = `transfer-data:${playerName.toLowerCase()}`;
    const cached = cache.get<TransfermarktPlayerData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    if (!API_TOKEN) {
      console.warn('Transfermarkt API token not configured');
      return null;
    }

    try {
      const playerUrl = this.getTransfermarktUrl(playerName);
      
      // Call Apify API
      const response = await axios.post(
        `${BASE_URL}/${ACTOR_ID}/run-sync-get-dataset-items`,
        {
          startUrls: [{ url: playerUrl }],
          maxItems: 1,
        },
        {
          params: { token: API_TOKEN },
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds for scraping
        }
      );

      const data = response.data;
      if (!data || data.length === 0) {
        console.warn(`No data found for player: ${playerName}`);
        return null;
      }

      const playerData = data[0] as TransfermarktPlayerData;
      
      // Cache the result
      cache.set(cacheKey, playerData, CACHE_TTL);
      
      return playerData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Transfermarkt API error:', axiosError.response?.status, axiosError.message);
      } else {
        console.error('Transfermarkt error:', error);
      }
      
      // Return null on error - graceful degradation
      return null;
    }
  }
}

export const transfermarktClient = new TransfermarktClient();
