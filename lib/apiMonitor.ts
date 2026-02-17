// API usage monitoring and rate limit tracking

interface APIUsage {
  sportsapipro: number;
  apiFootball: number;
  lastReset: string;
}

const DAILY_LIMIT = 100;

class APIMonitor {
  private usage: APIUsage = {
    sportsapipro: 0,
    apiFootball: 0,
    lastReset: new Date().toISOString().split('T')[0],
  };

  private checkReset(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.usage.lastReset !== today) {
      this.usage = {
        sportsapipro: 0,
        apiFootball: 0,
        lastReset: today,
      };
    }
  }

  incrementSportsAPIPro(): void {
    this.checkReset();
    this.usage.sportsapipro++;
  }

  incrementAPIFootball(): void {
    this.checkReset();
    this.usage.apiFootball++;
  }

  getUsage(): APIUsage {
    this.checkReset();
    return { ...this.usage };
  }

  isAtLimit(provider: 'sportsapipro' | 'apiFootball'): boolean {
    this.checkReset();
    return this.usage[provider] >= DAILY_LIMIT;
  }

  getRemainingCalls(provider: 'sportsapipro' | 'apiFootball'): number {
    this.checkReset();
    return Math.max(0, DAILY_LIMIT - this.usage[provider]);
  }
}

export const apiMonitor = new APIMonitor();
