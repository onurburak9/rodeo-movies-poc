# 🎬 Rodeo Movies POC

A proof-of-concept implementation of a **Rodeo-like visual bookmarking app** focused on **movies and Letterboxd integration**.

## What is this?

This project replicates the core functionality of the [Rodeo app](https://apps.apple.com/us/app/rodeo-save-it-do-it/id6753013160) — an AI-powered app that turns screenshots into actionable plans — but focused specifically on movie discovery and watchlist management.

### Core Concept
1. **Upload a screenshot** of a movie poster, Instagram post, IMDb page, or chat message
2. **Hybrid AI extracts** the movie identity automatically (OpenAI + Gemini fallback)
3. **Enrich with metadata** from TMDB (ratings, synopsis, cast, etc.)
4. **Sync with Letterboxd** to keep your watchlist in sync (Phase 2)
5. **Organize** into custom lists and share with friends (Phase 3)

## 📖 Implementation Plan

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the full technical specification.

See [AI_SERVICES.md](./docs/AI_SERVICES.md) for detailed AI strategy documentation.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (optional - app works without DB)
- API Keys:
  - [OpenAI API Key](https://platform.openai.com/api-keys) (required or use Gemini)
  - [Google Gemini API Key](https://aistudio.google.com/app/apikey) (recommended for complex images)
  - [TMDB API Key](https://www.themoviedb.org/settings/api) (required)

### 1. Clone and Setup

```bash
git clone https://github.com/onurburak9/rodeo-movies-poc.git
cd rodeo-movies-poc
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys:
# OPENAI_API_KEY=sk-your-key-here        (primary - cheap & fast)
# GEMINI_API_KEY=your-gemini-key-here    (fallback - better on complex layouts)
# TMDB_API_KEY=your-tmdb-key-here        (required for movie data)

# Start the server
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Test the App

1. Open `http://localhost:3000` in your browser
2. Upload a movie poster screenshot or drag-and-drop an image
3. The AI will analyze it and show the matched movie from TMDB
4. Check if "Fallback" badge appears (means Gemini was used for complex image)

## ✨ MVP Features (Implemented)

- [x] **Screenshot Upload** - Drag & drop or click to upload
- [x] **Hybrid AI Analysis** - OpenAI GPT-4o-mini primary + Gemini Pro Vision fallback
- [x] **Multi-source Support** - Handles posters, Instagram, web pages, chat messages
- [x] **TMDB Integration** - Fetches full movie metadata (poster, rating, cast, synopsis)
- [x] **Movie Display** - Shows rich movie card with AI provider info
- [x] **Recent Additions** - Lists recently analyzed movies with confidence scores
- [x] **AI Health Check** - Endpoint to verify AI service status

## 🤖 Hybrid AI Strategy

The app uses a cost-optimized dual-provider approach:

```
┌──────────────────┐     ┌──────────────┐
│  OpenAI GPT-4o   │────▶│ Confidence   │──┬── High ──▶ Done
│   ~$0.0006/img    │     │   Check      │  │
└──────────────────┘     └──────────────┘  └── Low ────▶
                                                      │
                                           ┌──────────┴──────────┐
                                           ▼                     │
                                    ┌──────────────────┐         │
                                    │  Google Gemini   │─────────┤
                                    │  ~$0.001875/img  │         │
                                    └──────────────────┘         │
                                           │                     │
                                           └─────────────────────┘
                                                      │
                                                      ▼
                                                   Return
```

### Why This Approach?

- **OpenAI first** (80% of cases): Cheapest option for clear movie posters
- **Gemini fallback** (20% of cases): Better at Instagram posts, cluttered web pages, chat messages
- **Cost savings**: ~60% cheaper than using Gemini exclusively

### Supported Screenshot Types

| Type | Primary (OpenAI) | Fallback (Gemini) |
|------|------------------|-------------------|
| Movie Posters | ✅ Excellent | ✅ Excellent |
| Instagram Posts | ⚠️ Okay | ✅ Better |
| Webpage Screenshots | ⚠️ Hit-or-miss | ✅ Better |
| IMDb Screenshots | ✅ Good | ✅ Good |
| Chat Messages | ⚠️ Poor | ✅ Better |
| Streaming UI Grids | ⚠️ Okay | ✅ Better |

See [AI_SERVICES.md](./docs/AI_SERVICES.md) for full documentation.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + Sequelize
- **Database**: PostgreSQL (optional - falls back to in-memory)
- **AI**: OpenAI GPT-4o-mini + Google Gemini Pro Vision
- **Movie Data**: TMDB API

## 📁 Project Structure

```
rodeo-movies-poc/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI & TMDB services
│   │   │   ├── aiService.js      # Hybrid AI (OpenAI + Gemini)
│   │   │   └── tmdbService.js    # TMDB integration
│   │   └── app.js          # Main app entry
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── docs/
│   └── AI_SERVICES.md      # AI strategy documentation
├── IMPLEMENTATION.md
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://localhost:5432/rodeo_movies

# AI Providers (at least one required, both recommended)
OPENAI_API_KEY=sk-your-openai-key
GEMINI_API_KEY=your-gemini-key

# Movie Database (required)
TMDB_API_KEY=your-tmdb-key
```

## 🧪 Testing Locally

### Test Flow:
1. **Upload Image** - Use any movie-related screenshot
2. **AI Analysis** - Primary (OpenAI) → Fallback (Gemini if needed)
3. **Movie Lookup** - Extracted title is searched on TMDB
4. **Display** - Full movie details with AI provider badge

### Example Images to Test:
- **Movie posters** from Google Images → Should use OpenAI
- **Instagram posts** with filters → May trigger Gemini fallback
- **Netflix browse grid** → Likely triggers Gemini fallback
- **Chat message screenshots** → Likely triggers Gemini fallback
- **Letterboxd page** → Depends on layout

### API Testing:
```bash
# Health check
curl http://localhost:3001/health

# AI services health check
curl http://localhost:3001/api/movies/health/ai

# Analyze image (base64 encoded)
curl -X POST http://localhost:3001/api/movies/analyze \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,/9j/4AAQ..."}'
```

## 💰 Cost Estimates

Assuming 100 screenshots per day:

| Strategy | Daily Cost | Monthly Cost |
|----------|------------|--------------|
| OpenAI Only | ~$0.06 | ~$1.80 |
| Gemini Only | ~$0.19 | ~$5.70 |
| **Hybrid (our approach)** | **~$0.09** | **~$2.70** |

Hybrid assumes 80% high confidence from OpenAI, 20% fallback to Gemini.

## 🐛 Troubleshooting

**OpenAI API errors**: Check your API key and billing status at platform.openai.com

**Gemini API errors**: Check your API key at aistudio.google.com/app/apikey

**TMDB rate limits**: Free tier allows 40 requests per 10 seconds

**Database errors**: App works without PostgreSQL - it will log a warning but continue

**CORS errors**: Make sure backend is running on port 3001 (frontend proxy is configured)

## 🤝 Contributing

This is a POC project. Feel free to fork and extend!

## 📄 License

MIT

---

Built with ❤️ for movie lovers everywhere.
