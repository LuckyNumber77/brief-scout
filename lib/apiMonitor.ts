interface APIUsage {
  count: number;
  lastReset: number;
}

class APIMonitor {
  private usage: Map<string, APIUsage>;

  constructor() {
    this.usage = new Map();
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private shouldReset(lastReset: number): boolean {
    const today = this.getToday();
    const lastResetDate = new Date(lastReset).toISOString().split('T')[0];
    return today !== lastResetDate;
  }

  track(provider: string): void {
    const usage = this.usage.get(provider);
    const now = Date.now();

    if (!usage || this.shouldReset(usage.lastReset)) {
      this.usage.set(provider, { count: 1, lastReset: now });
    } else {
      usage.count += 1;
      this.usage.set(provider, usage);
    }
  }

  getUsage(provider: string): number {
    const usage = this.usage.get(provider);

    if (!usage || this.shouldReset(usage.lastReset)) {
      return 0;
    }

    return usage.count;
  }

  getAllUsage(): Record<string, number> {
    const result: Record<string, number> = {};

    this.usage.forEach((usage, provider) => {
      if (this.shouldReset(usage.lastReset)) {
        result[provider] = 0;
      } else {
        result[provider] = usage.count;
      }
    });

    return result;
  }

  reset(provider?: string): void {
    if (provider) {
      this.usage.delete(provider);
    } else {
      this.usage.clear();
    }
  }
}

// Singleton instance
export const apiMonitor = new APIMonitor();
