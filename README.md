# RedditStocks

A full-stack application to track stock mentions from Reddit (r/wallstreetbets, r/stocks) and analyze sentiment.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Reddit API**: Snoowrap

## Project Structure

```
RedditStocks/
├── frontend/          # React application
├── backend/           # Express API
└── package.json       # Root workspace config
```

## Prerequisites

- Node.js 18+ and npm
- Reddit API credentials (see setup below)

## Getting Reddit API Credentials

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the form:
   - **name**: RedditStocks (or any name)
   - **App type**: Select "script"
   - **description**: Optional
   - **about url**: Optional
   - **redirect uri**: http://localhost:3001 (required but not used for script apps)
4. Click "Create app"
5. You'll see your credentials:
   - **client ID**: The string under "personal use script"
   - **client secret**: The "secret" field

## Setup Instructions

### 1. Install Dependencies

```bash
# From the root directory
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure Backend Environment

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your Reddit credentials:

```env
PORT=3001
NODE_ENV=development

REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
REDDIT_USER_AGENT=RedditStocks/1.0

SUBREDDITS=wallstreetbets,stocks
```

### 3. Run the Application

**Option 1: Run both frontend and backend together**
```bash
# From the root directory
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

The frontend will be available at http://localhost:5173
The backend API will be available at http://localhost:3001

## API Endpoints

### Test Connection
```
GET http://localhost:3001/api/reddit/test
```

### Get Posts from a Subreddit
```
GET http://localhost:3001/api/reddit/posts/wallstreetbets?limit=10&sort=hot
```

Query parameters:
- `limit`: Number of posts (default: 25)
- `sort`: Sort type - `hot`, `new`, or `top` (default: hot)

### Get Posts from Multiple Subreddits
```
GET http://localhost:3001/api/reddit/posts?subreddits=wallstreetbets,stocks&limit=10
```

## Features Implemented

✅ Basic React frontend with Vite
✅ Express backend with TypeScript
✅ Reddit API integration using Snoowrap
✅ Fetch posts from r/wallstreetbets and r/stocks
✅ Display posts with metadata (score, comments, author)
✅ Connection status indicator

## Next Steps

- [ ] Add stock ticker parsing from post text
- [ ] Implement sentiment analysis
- [ ] Add database (PostgreSQL) for storing mentions
- [ ] Track trends over time
- [ ] Add AI-powered summarization with Claude
- [ ] Charts and data visualization

## Troubleshooting

### "Failed to connect to Reddit API"

1. Verify your Reddit credentials in `backend/.env`
2. Make sure you're using a "script" type app (not "web app")
3. Check that your Reddit username and password are correct
4. Ensure you have a stable internet connection

### CORS Errors

The backend is configured to allow CORS from the frontend (localhost:5173). If you change the frontend port, update the CORS configuration in `backend/src/server.ts`.

### Port Already in Use

If port 3001 or 5173 is already in use, you can change them:
- Backend: Edit `PORT` in `backend/.env`
- Frontend: Add `--port 3000` to the dev script in `frontend/package.json`

## License

MIT
