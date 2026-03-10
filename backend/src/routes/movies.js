import express from 'express';
import {
  analyzeScreenshot,
  getMovie,
  searchMovies,
  getRecentMovies,
} from '../controllers/movieController.js';

const router = express.Router();

// POST /api/movies/analyze - Analyze screenshot
router.post('/analyze', analyzeScreenshot);

// GET /api/movies/search?q=query - Search TMDB
router.get('/search', searchMovies);

// GET /api/movies/recent - Get recent additions
router.get('/recent', getRecentMovies);

// GET /api/movies/:id - Get movie details
router.get('/:id', getMovie);

export default router;
