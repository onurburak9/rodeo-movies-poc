# 🎬 Rodeo Movies POC

A proof-of-concept implementation of a **Rodeo-like visual bookmarking app** focused on **movies and Letterboxd integration**.

## What is this?

This project replicates the core functionality of the [Rodeo app](https://apps.apple.com/us/app/rodeo-save-it-do-it/id6753013160) — an AI-powered app that turns screenshots into actionable plans — but focused specifically on movie discovery and watchlist management.

### Core Concept
1. **Upload a screenshot** of a movie poster, streaming UI, or Letterboxd page
2. **AI extracts** the movie identity automatically
3. **Enrich with metadata** from TMDB (ratings, synopsis, cast, etc.)
4. **Sync with Letterboxd** to keep your watchlist in sync
5. **Organize** into custom lists and share with friends

## 📖 Implementation Plan

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the full technical specification including:
- Feature breakdown
- Architecture decisions
- API integrations
- Database schema
- Wireframes
- Implementation phases

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/onurburak9/rodeo-movies-poc.git
cd rodeo-movies-poc

# Backend setup
cd backend
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4 Vision or Google Gemini
- **Movie Data**: TMDB API
- **Watchlist Sync**: Letterboxd (unofficial API)

## ✨ Features (Planned)

- [x] Screenshot-to-movie recognition via AI
- [x] TMDB metadata enrichment
- [x] Custom watchlists
- [x] Letterboxd integration
- [ ] Streaming availability (JustWatch)
- [ ] Social sharing
- [ ] Mobile PWA

## 📸 Screenshots

*Coming soon...*

## 🤝 Contributing

This is a POC project. Feel free to fork and extend!

## 📄 License

MIT

---

Built with ❤️ for movie lovers everywhere.
