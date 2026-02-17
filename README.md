# Brief Scout

AI-powered football/soccer player scouting application. Search for teams, view their next match, and get intelligent "Player to Watch" recommendations based on recent form.

## Features

- 🔍 **Team Search**: Search for any football team with autocomplete
- ⚽ **Next Match Details**: View upcoming fixtures with venue and competition info
- 📊 **Team Form Analysis**: Last 5 matches visualization (W-D-L)
- 🌟 **Player to Watch**: AI-selected player based on FormScore algorithm
- 🤖 **AI Insights**: OpenAI-powered match analysis and player reasoning
- 💾 **Smart Caching**: Server and client-side caching to reduce API calls
- 📱 **Responsive Design**: Works on mobile and desktop
- 🎨 **Futuristic UI**: Dark theme with glassmorphism effects

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **APIs**:
  - SportsAPIPro (team search, fixtures)
  - API-Football (player stats, detailed data)
  - OpenAI (AI-generated insights)
- **Caching**: In-memory server cache + localStorage client cache

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
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

3. Create `.env` file from the example:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
SPORTSAPIPRO_API_KEY=your_sportsapipro_key
API_FOOTBALL_KEY=your_api_football_key
OPENAI_API_KEY=your_openai_key
NODE_ENV=development
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a team name in the search bar (minimum 3 characters)
2. Select a team from the dropdown
3. View the team brief including:
   - Next match details
   - Team form (last 5 matches)
   - Player to Watch with stats and AI reasoning
   - AI-generated matchup analysis

## Architecture

### FormScore Algorithm

Players are ranked using a weighted scoring system:
- Goals × 4
- Assists × 3
- Shots on Target × 2
- Key Passes × 1
- Minutes consistency bonus (+3 or +1)

The highest-scoring player is selected as "Player to Watch"

### Caching Strategy

**Server-side (in-memory)**:
- Team search: 4 hours
- Team brief: 1 hour
- AI responses: 1 hour per team/fixture

**Client-side (localStorage)**:
- Search results: 10 minutes
- Team briefs: 1 hour

### API Rate Limiting

- SportsAPIPro: 100 calls/day
- API-Football: 100 calls/day
- Total budget: 200 calls/day
- Caching reduces API usage by 80%+

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms

The app works on any serverless platform that supports Next.js 14:
- Netlify
- AWS Amplify
- Railway
- Render

## Project Structure

```
brief-scout/
├── app/
│   ├── api/
│   │   ├── team-search/route.ts
│   │   └── team-brief/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── StatBadge.tsx
│   │   └── ConfidenceBadge.tsx
│   ├── TeamSearch.tsx
│   ├── TeamBrief.tsx
│   ├── NextMatchCard.tsx
│   ├── PlayerToWatchCard.tsx
│   ├── MatchupNotesCard.tsx
│   └── RateLimitWarning.tsx
├── lib/
│   ├── api-clients/
│   │   ├── sportsapipro.ts
│   │   └── api-football.ts
│   ├── types.ts
│   ├── cache.ts
│   ├── clientCache.ts
│   ├── formScore.ts
│   ├── ai.ts
│   └── apiMonitor.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPORTSAPIPRO_API_KEY` | SportsAPIPro API key | Yes |
| `API_FOOTBALL_KEY` | API-Football API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
