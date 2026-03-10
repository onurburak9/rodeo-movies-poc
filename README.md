# 🎬 Rodeo Movies POC

A proof-of-concept implementation of a **Rodeo-like visual bookmarking app** focused on **movies and Letterboxd integration**.

## What is this?

This project replicates the core functionality of the [Rodeo app](https://apps.apple.com/us/app/rodeo-save-it-do-it/id6753013160) — an AI-powered app that turns screenshots into actionable plans — but focused specifically on movie discovery and watchlist management.

### Core Concept
1. **Upload a screenshot** of a movie poster, streaming UI, or Letterboxd page
2. **AI extracts** the movie identity automatically (OpenAI Vision)
3. **Enrich with metadata** from TMDB (ratings, synopsis, cast, etc.)
4. **Sync with Letterboxd** to keep your watchlist in sync (Phase 2)
5. **Organize** into custom lists and share with friends (Phase 3)

## 📖 Implementation Plan

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the full technical specification.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (optional - app works without DB)
- API Keys:
  - [OpenAI API Key](https://platform.openai.com/api-keys)
  - [TMDB API Key](https://www.themoviedb.org/settings/api)

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
# OPENAI_API_KEY=sk-your-key-here
# TMDB_API_KEY=your-tmdb-key-here

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

## ✨ MVP Features (Implemented)

- [x] **Screenshot Upload** - Drag & drop or click to upload
- [x] **AI Image Analysis** - OpenAI GPT-4 Vision extracts movie title/year
- [x] **TMDB Integration** - Fetches full movie metadata (poster, rating, cast, synopsis)
- [x] **Movie Display** - Shows rich movie card with all details
- [x] **Recent Additions** - Lists recently analyzed movies

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + Sequelize
- **Database**: PostgreSQL (optional - falls back to in-memory)
- **AI**: OpenAI GPT-4o-mini Vision
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
├── IMPLEMENTATION.md
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://localhost:5432/rodeo_movies
OPENAI_API_KEY=sk-your-openai-key
TMDB_API_KEY=your-tmdb-key
```

## 🧪 Testing Locally

### Test Flow:
1. **Upload Image** - Use any movie poster image
2. **AI Analysis** - The app sends the image to OpenAI Vision
3. **Movie Lookup** - Extracted title is searched on TMDB
4. **Display** - Full movie details are shown with poster, rating, cast

### Example Images to Test:
- Movie posters from Google Images
- Screenshots from Netflix/Prime Video browsing
- Letterboxd page screenshots
- Physical DVD/Blu-ray covers photographed

### API Testing:
```bash
# Health check
curl http://localhost:3001/health

# Analyze image (base64 encoded)
curl -X POST http://localhost:3001/api/movies/analyze \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,/9j/4AAQ..."}'
```

## 🐛 Troubleshooting

**OpenAI API errors**: Check your API key and billing status at platform.openai.com

**TMDB rate limits**: Free tier allows 40 requests per 10 seconds

**Database errors**: App works without PostgreSQL - it will log a warning but continue

**CORS errors**: Make sure backend is running on port 3001 (frontend proxy is configured)

## 🤝 Contributing

This is a POC project. Feel free to fork and extend!

## 📄 License

MIT

---

Built with ❤️ for movie lovers everywhere.
