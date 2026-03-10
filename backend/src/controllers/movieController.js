import { Movie, Screenshot } from '../models/movie.js';
import { analyzeImage } from '../services/aiService.js';
import { searchMovie } from '../services/tmdbService.js';

/**
 * Analyze screenshot and find matching movie
 */
export const analyzeScreenshot = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Step 1: AI Analysis
    console.log('🔍 Analyzing image with AI...');
    const aiResult = await analyzeImage(base64Image);
    
    console.log('AI Result:', aiResult);

    if (!aiResult.title) {
      return res.status(404).json({
        error: 'Could not identify movie from image',
        aiResult,
      });
    }

    // Step 2: Search TMDB
    console.log(`🔍 Searching TMDB for: ${aiResult.title} (${aiResult.year || 'any year'})`);
    const movieData = await searchMovie(aiResult.title, aiResult.year);

    if (!movieData) {
      return res.status(404).json({
        error: 'Movie not found in database',
        aiResult,
      });
    }

    // Step 3: Save to database
    let movie = await Movie.findOne({ where: { tmdbId: movieData.tmdbId } });
    
    if (!movie) {
      movie = await Movie.create(movieData);
    }

    // Save screenshot record
    const screenshot = await Screenshot.create({
      imageUrl: image,
      extractedTitle: aiResult.title,
      extractedYear: aiResult.year,
      confidence: aiResult.confidence,
      movieId: movie.id,
    });

    return res.json({
      success: true,
      movie: {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        posterPath: movie.posterPath,
        rating: movie.rating,
        synopsis: movie.synopsis,
        runtime: movie.runtime,
        genres: movie.genres,
        cast: movie.cast,
        director: movie.director,
      },
      aiAnalysis: aiResult,
    });
  } catch (error) {
    console.error('Analyze Screenshot Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get movie details by ID
 */
export const getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    return res.json(movie);
  } catch (error) {
    console.error('Get Movie Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Search movies by query
 */
export const searchMovies = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query required' });
    }

    const results = await searchMovie(q);
    return res.json(results ? [results] : []);
  } catch (error) {
    console.error('Search Movies Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get recent screenshots/movies
 */
export const getRecentMovies = async (req, res) => {
  try {
    const screenshots = await Screenshot.findAll({
      include: [Movie],
      order: [['createdAt', 'DESC']],
      limit: 20,
    });

    return res.json(screenshots);
  } catch (error) {
    console.error('Get Recent Movies Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export default {
  analyzeScreenshot,
  getMovie,
  searchMovies,
  getRecentMovies,
};
