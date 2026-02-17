# Brief Scout - Deployment Guide

## Prerequisites

1. **API Keys** (Required)
   - SportsAPIPro API key: https://sportsapipro.com/
   - API-Football key: https://api-sports.io/
   - OpenAI API key: https://platform.openai.com/

2. **Node.js** (v18 or higher)

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/LuckyNumber77/brief-scout.git
cd brief-scout
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
SPORTSAPIPRO_API_KEY=your_sportsapipro_key_here
API_FOOTBALL_KEY=your_api_football_key_here
OPENAI_API_KEY=your_openai_key_here
NODE_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `SPORTSAPIPRO_API_KEY`
   - `API_FOOTBALL_KEY`
   - `OPENAI_API_KEY`
6. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add SPORTSAPIPRO_API_KEY
vercel env add API_FOOTBALL_KEY
vercel env add OPENAI_API_KEY

# Deploy to production
vercel --prod
```

## Deployment to Other Platforms

### Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. Set environment variables in Netlify dashboard

### Railway

1. Create new project on [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically on push

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPORTSAPIPRO_API_KEY` | SportsAPIPro API authentication key | Yes |
| `API_FOOTBALL_KEY` | API-Football authentication key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI analysis | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## API Rate Limits

- **SportsAPIPro**: 100 requests/day
- **API-Football**: 100 requests/day
- **Total Budget**: 200 requests/day

The app uses aggressive caching to stay within limits:
- Team search: 4 hours server cache
- Team brief: 1 hour server + client cache
- AI responses: 1 hour per team/fixture

## Performance Optimization

### Caching Strategy

1. **Server-side (In-memory)**
   - Team search results: 4 hours
   - Team brief: 1 hour
   - AI responses: 1 hour

2. **Client-side (localStorage)**
   - Search results: 10 minutes
   - Team briefs: 1 hour

### Expected API Usage

With caching, typical usage:
- New team search: 1 API call
- Team brief (first load): 3 API calls
- Subsequent loads: 0 API calls (cached)

**Daily usage**: 20-50 API calls for normal use (well under 200 limit)

## Monitoring

### Check API Usage

Server logs will show API call tracking:
```
API call made to: sportsapipro
API call made to: api-football
```

### Error Handling

The app has fallback mechanisms:
- If SportsAPIPro fails → tries API-Football
- If API-Football fails → tries SportsAPIPro
- If both fail → shows user-friendly error

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### API Errors

1. Verify API keys are correct
2. Check API rate limits haven't been exceeded
3. Check API service status
4. Review server logs

### Image Loading Issues

If team/player images don't load, check `next.config.mjs` has correct hostnames:
- `media.api-sports.io`
- `v1.football.sportsapipro.com`
- `media-1.api-sports.io`
- `media-2.api-sports.io`
- `media-3.api-sports.io`

## Security

### Environment Variables

- **Never commit** `.env` file to git
- Use `.env.example` as template
- Set environment variables in deployment platform
- Rotate API keys periodically

### Image Sources

The app only loads images from verified sources (see next.config.mjs)

## Support

For issues:
1. Check [GitHub Issues](https://github.com/LuckyNumber77/brief-scout/issues)
2. Review server logs
3. Verify API keys and rate limits

## License

MIT License - See LICENSE file for details
