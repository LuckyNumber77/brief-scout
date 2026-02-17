# Brief Scout

AI-powered football player scouting app

## Features

- 🔍 **Team Search**: Find any football team with intelligent search
- ⚽ **Next Match Info**: View upcoming fixtures and team form
- 🌟 **Player to Watch**: AI-selected player based on FormScore algorithm
- 🤖 **AI Insights**: OpenAI-powered match analysis and player reasoning
- 💾 **Smart Caching**: Multi-layer caching to minimize API calls
- 📊 **Rate Limiting**: Built-in API usage monitoring

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS with custom dark theme
- **AI**: OpenAI GPT-3.5-turbo
- **APIs**: SportsAPIPro & API-Football

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API keys for:
  - SportsAPIPro
  - API-Football
  - OpenAI

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
```

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

## Caching Strategy

### Server-side (In-memory)
- Team search: 4 hours
- Team brief: 1 hour
- AI responses: 1 hour per team/fixture

### Client-side (localStorage)
- Search results: 10 minutes
- Team briefs: 1 hour

## API Usage

Both external APIs have 100 requests/day limits. The app implements:
- Multi-layer caching to minimize calls
- Fallback between APIs for reliability
- Usage tracking with auto-reset at midnight

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
