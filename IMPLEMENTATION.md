# Rodeo Movies POC - Implementation Plan

## Overview

A proof-of-concept implementation of a **Rodeo-like visual bookmarking app** focused specifically on **movies and Letterboxd integration**.

### What is Rodeo?
Rodeo is an AI-powered social planning app that:
- Takes screenshots, social media posts, links, and photos as input
- Uses AI to extract structured data (events, restaurants, movies, etc.)
- Organizes items into collaborative lists
- Enriches items with actionable details (showtimes, locations, reservations)
- Helps users make plans with friends

### This POC Focus
**Movies + Letterboxd** - A scoped version that:
1. Accepts movie screenshots (posters, Letterboxd pages, streaming app UI)
2. Extracts movie identity via AI/computer vision
3. Enriches with movie metadata (TMDB/OMDb APIs)
4. Integrates with Letterboxd (watchlist, diary, ratings)
5. Organizes into personal watchlists

---

## Core Features

### 1. Screenshot-to-Movie Recognition
- Upload a screenshot of a movie poster, streaming UI, or Letterboxd page
- AI extracts movie title, year, and visual identity
- Fallback to manual search if AI confidence is low

### 2. Movie Metadata Enrichment
- Fetch from TMDB (The Movie Database) API
- Synopsis, cast, crew, ratings, runtime, genres
- Poster and backdrop images
- "Where to watch" streaming availability

### 3. Letterboxd Integration
- OAuth authentication with Letterboxd
- Sync watchlist to/from Letterboxd
- Log diary entries (watched date, rating, review)
- Import existing Letterboxd data

### 4. Watchlist Management
- Create multiple custom lists ("Date Night", "Oscar Contenders", etc.)
- Tags and filters (genre, year, rating, streaming service)
- Sort by various criteria

### 5. Social Features (Future)
- Share lists with friends
- Collaborative lists
- Recommendations between users

---

## Technical Architecture

### Tech Stack Recommendation

```
Frontend: React + TypeScript + Tailwind CSS
Backend: Node.js + Express or Python + FastAPI
Database: PostgreSQL + Redis (for caching)
AI/ML: OpenAI Vision API or Google Gemini Vision
Image Storage: Cloudinary or AWS S3
Auth: Auth0 or Firebase Auth
APIs: TMDB API, Letterboxd API (unofficial)
```

### System Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Upload   │────▶│  Image Analysis  │────▶│  Movie Identity │
│  (Screenshot)   │     │  (Vision AI)     │     │  (Title, Year)  │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                              ┌───────────────────────────┼──────────┐
                              │                           │          │
                              ▼                           ▼          ▼
                    ┌──────────────────┐      ┌──────────────────┐  ┌──────────────┐
                    │   TMDB API       │      │  Letterboxd API  │  │   Database   │
                    │  (Metadata)      │      │  (Watchlist/Sync)│  │  (User Data) │
                    └──────────────────┘      └──────────────────┘  └──────────────┘
```

---

## Implementation Phases

### Phase 1: MVP - Basic Screenshot Recognition (Week 1-2)

**Goals:**
- Accept image upload
- Extract movie title from screenshot using Vision AI
- Display basic movie info from TMDB

**Components:**
1. **Frontend Upload Component**
   - Drag-and-drop image upload
   - Camera capture (mobile)
   - Image preview

2. **Backend Image Processing**
   - OpenAI GPT-4 Vision or Google Gemini Vision API
   - Prompt: "What movie is shown in this image? Return title and year only."
   - Handle errors gracefully (low confidence → manual input)

3. **TMDB Integration**
   - Search movie by title/year
   - Display basic info (poster, title, year, rating)
   - Store in local database

**APIs Needed:**
- OpenAI Vision API or Google Gemini
- TMDB API (free tier: 40 requests/10 seconds)

---

### Phase 2: Letterboxd Integration (Week 3-4)

**Goals:**
- Authenticate with Letterboxd
- Import user's watchlist
- Add movies to Letterboxd watchlist
- Log watched movies

**Components:**
1. **Letterboxd OAuth**
   - Note: Letterboxd doesn't have official public API
   - Use unofficial API or web scraping (respect rate limits)
   - Alternative: Manual CSV import/export

2. **Sync Features**
   - Import existing watchlist
   - Two-way sync (add to app → add to Letterboxd)
   - Diary entry logging

3. **UI Updates**
   - Letterboxd connection settings
   - "Add to Watchlist" button
   - "Mark as Watched" with rating

**Implementation Notes:**
Letterboxd API access is limited. Consider:
- Partner API application (requires approval)
- Browser extension approach for web scraping
- Fallback to manual Letterboxd list export/import

---

### Phase 3: Watchlist Management (Week 5-6)

**Goals:**
- Custom lists
- Tags and filters
- Better UI/UX

**Components:**
1. **List Management**
   - Create/edit/delete lists
   - Add/remove movies from lists
   - List sharing (public/private links)

2. **Filtering & Sorting**
   - Filter by genre, year, rating, streaming service
   - Sort by date added, rating, release year
   - Search within lists

3. **Movie Detail View**
   - Full movie info page
   - Cast and crew
   - Trailer embed
   - "Where to watch" section

4. **Database Schema**
```sql
-- Users table
users (id, email, letterboxd_username, created_at)

-- Movies table (cached from TMDB)
movies (id, tmdb_id, title, year, poster_url, synopsis, rating, runtime, genres)

-- User's saved movies
user_movies (id, user_id, movie_id, list_id, status, rating, review, created_at)

-- Lists table
lists (id, user_id, name, description, is_public, created_at)

-- Screenshots (for AI training/analysis history)
screenshots (id, user_id, image_url, extracted_title, extracted_year, confidence, created_at)
```

---

### Phase 4: Advanced Features (Week 7-8)

**Goals:**
- Better AI extraction
- Mobile app
- Recommendations

**Components:**
1. **Improved AI Prompting**
   - Multi-modal understanding (poster + text in screenshot)
   - Handle streaming app UIs (Netflix, etc.)
   - Extract additional context ("Coming March 2025")

2. **Streaming Availability**
   - Integration with JustWatch API
   - Show where to stream/rent/buy
   - Region-specific availability

3. **Mobile Considerations**
   - PWA (Progressive Web App)
   - Share sheet integration (iOS/Android)
   - Camera capture optimization

4. **Recommendations**
   - Based on watch history
   - Similar movies from TMDB
   - Friend recommendations

---

## API References

### TMDB API
```
Endpoint: https://api.themoviedb.org/3
Docs: https://developer.themoviedb.org/docs/getting-started

Key endpoints:
- GET /search/movie?query={title}&year={year}
- GET /movie/{movie_id}
- GET /movie/{movie_id}/watch/providers
- GET /movie/{movie_id}/similar
```

### OpenAI Vision API
```
Endpoint: https://api.openai.com/v1/chat/completions
Model: gpt-4o or gpt-4o-mini

Example prompt:
"What movie is shown in this image? 
If it's a movie poster or screenshot, identify the title and release year.
Return JSON: {\"title\": string, \"year\": number|null, \"confidence\": \"high|medium|low\"}"
```

### Letterboxd (Unofficial)
```
Note: No official public API
Community approaches:
- https://github.com/nickcolon/letterboxd-api (unofficial)
- Export: letterboxd.com/{username}/export
- Import: letterboxd.com/import
```

---

## Project Structure

```
rodeo-movies-poc/
├── README.md
├── IMPLEMENTATION.md (this file)
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── aiService.js       # Vision AI integration
│   │   │   ├── tmdbService.js     # TMDB API wrapper
│   │   │   └── letterboxdService.js
│   │   └── app.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload/
│   │   │   ├── MovieCard/
│   │   │   ├── MovieDetail/
│   │   │   └── Watchlist/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── index.html
└── docs/
    ├── wireframes.md
    └── api-integration.md
```

---

## Getting Started (Quick Start)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- API keys: OpenAI, TMDB

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run migrate
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```env
# Backend
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/rodeo_movies
OPENAI_API_KEY=sk-...
TMDB_API_KEY=...

# Frontend
VITE_API_URL=http://localhost:3001
```

---

## Key Technical Decisions

### 1. AI Service Choice
**Option A: OpenAI GPT-4 Vision**
- Pros: High accuracy, handles complex images well
- Cons: Paid, rate limits

**Option B: Google Gemini Pro Vision**
- Pros: Competitive accuracy, potentially lower cost
- Cons: Newer, less tested

**Recommendation:** Start with OpenAI GPT-4o-mini (cheaper, fast) and upgrade if needed.

### 2. Letterboxd Integration Approach
**Option A: Official Partner API**
- Pros: Reliable, supported
- Cons: Requires approval, limited access

**Option B: Unofficial API/Web Scraping**
- Pros: Full feature access
- Cons: Fragile, may break, ToS concerns

**Option C: Manual Import/Export**
- Pros: Works today, reliable
- Cons: User friction

**Recommendation:** Implement Option C first, then pursue Option A for better UX.

### 3. Image Storage
**Option A: Cloudinary**
- Pros: Built-in optimization, transformations
- Cons: Additional service

**Option B: AWS S3 + CloudFront**
- Pros: Full control, cost-effective at scale
- Cons: More setup

**Recommendation:** Cloudinary for POC (free tier sufficient), migrate to S3 if scaling.

---

## Wireframes

### Home Screen
```
┌─────────────────────────────────────┐
│  📸 Rodeo Movies                    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Upload Screenshot         │    │
│  │   (or paste image)          │    │
│  └─────────────────────────────┘    │
│                                     │
│  Recent Additions                   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │🎬 │ │🎬 │ │🎬 │ │🎬 │       │
│  └────┘ └────┘ └────┘ └────┘       │
│                                     │
│  My Lists                           │
│  • Watchlist (23)                   │
│  • Date Night (8)                   │
│  • Oscar 2025 (12)                  │
│                                     │
└─────────────────────────────────────┘
```

### Upload Flow
```
┌─────────────────────────────────────┐
│  Upload Screenshot                  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │    [Image Preview]          │    │
│  │                             │    │
│  │   Dune: Part Two (2024)     │    │
│  │   ✓ AI recognized           │    │
│  └─────────────────────────────┘    │
│                                     │
│  Add to:                            │
│  [ ] Watchlist    [ ] Date Night    │
│                                     │
│  [   Save Movie   ]                 │
│                                     │
└─────────────────────────────────────┘
```

---

## Success Metrics for POC

1. **AI Accuracy**: >80% correct movie identification from screenshots
2. **TMDB Match**: <2 second response time for movie lookup
3. **User Flow**: Upload → Save to list in <30 seconds
4. **Letterboxd**: Successful watchlist import for test accounts

---

## Future Enhancements

- **TV Shows**: Extend beyond movies to series
- **Books**: Goodreads integration
- **Restaurants**: Yelp/Google Maps integration
- **Events**: Ticketmaster/Eventbrite integration
- **Chrome Extension**: Capture directly from browser
- **Mobile Apps**: Native iOS/Android apps
- **Social**: Friend following, activity feed
- **AI Recommendations**: "Based on your watchlist..."

---

## Resources

- [Rodeo App](https://apps.apple.com/us/app/rodeo-save-it-do-it/id6753013160)
- [TMDB API Docs](https://developer.themoviedb.org/docs/getting-started)
- [OpenAI Vision Guide](https://platform.openai.com/docs/guides/vision)
- [Letterboxd](https://letterboxd.com)

---

## License

MIT - Feel free to use this as a starting point for your own projects!
