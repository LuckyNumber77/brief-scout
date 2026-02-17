# Brief Scout

AI-powered football player scouting app

## Features

- 🔍 **Team Search**: Find any football team with intelligent search
- ⚽ **Next Match Info**: View upcoming fixtures and team form
- 🌟 **Player to Watch**: AI-selected player based on FormScore algorithm
- 🤖 **AI Insights**: OpenAI-powered match analysis and player reasoning
- 💰 **Transfer Market Data**: Player market values, transfer history, and loan status
- 📰 **Transfer News**: Recent transfer rumors and news from Transfermarkt
- 💾 **Smart Caching**: Multi-layer caching to minimize API calls
- 📊 **Rate Limiting**: Built-in API usage monitoring

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS with custom dark theme
- **AI**: OpenAI GPT-3.5-turbo
- **APIs**: 
  - SportsAPIPro & API-Football (match data)
  - Transfermarkt via Apify (transfer data)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API keys for:
  - SportsAPIPro
  - API-Football
  - OpenAI
  - Apify (optional, for transfer data)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LuckyNumber77/brief-scout.git
cd brief-scout
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```
SPORTSAPIPRO_API_KEY=your_key_here
API_FOOTBALL_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Optional: Transfer market data from Transfermarkt via Apify
APIFY_API_TOKEN=your_apify_token_here
TRANSFERMARKT_ACTOR_ID=webdatalabs-transfermarkt-scraper
```

**Note on Transfermarkt API (Optional):**
- Transfer market data is optional and the app will work without it
- To enable transfer data, sign up for an [Apify account](https://apify.com/)
- Get your API token from Apify dashboard
- The app gracefully handles missing transfer data without breaking core functionality

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## FormScore Algorithm

Player scoring is calculated from the last 5 matches:

- **Goals** × 4 points
- **Assists** × 3 points
- **Shots on Target** × 2 points
- **Key Passes** × 1 point
- **Minutes Consistency Bonus**:
  - +3 if played ≥70 mins in 4+ of last 5 matches
  - +1 if played ≥60 mins in 3+ of last 5 matches

The player with the highest FormScore is selected as "Player to Watch"

## Transfer Data Integration

The app displays comprehensive transfer market data for the "Player to Watch":

### Market Value
- Current market value displayed with currency
- Trend indicators (rising ↑, stable →, falling ↓)
- Automatic currency detection (typically EUR for Transfermarkt)

### Transfer History
- Timeline view of last 5 transfers
- Transfer fees and market values at time of transfer
- Transfer type badges (Permanent, Loan, Loan Return)
- Club names and dates

### Loan Status
- Yellow badge displays if player is currently on loan
- Shows loan origin and destination clubs
- Loan end date (when available)
- Buy option information (when available)

### Recent Transfer News
- Latest transfer rumors and news
- Source attribution
- Dates and headlines
- External links (when available)

**Note:** Transfer data is fetched from Transfermarkt via Apify API. If the API is unavailable or not configured, the app continues to work normally without transfer data.

## Caching Strategy

### Server-side (In-memory)
- Team search: 4 hours
- Team brief: 1 hour
- Transfer data: 6 hours
- AI responses: 1 hour per team/fixture

### Client-side (localStorage)
- Search results: 10 minutes
- Team briefs: 1 hour
- Transfer data: 2 hours (via HTTP cache headers)

## API Usage

The external APIs have daily limits. The app implements:
- Multi-layer caching to minimize calls
- Fallback between APIs for reliability
- Usage tracking with auto-reset at midnight
- Graceful degradation if transfer data is unavailable

**API Limits:**
- SportsAPIPro & API-Football: 100 requests/day (free tier)
- Apify: Varies by plan (transfer data is optional)

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LuckyNumber77/brief-scout)

Remember to add your environment variables in the Vercel dashboard.

## Build

```bash
npm run build
npm start
```

## License

MIT
