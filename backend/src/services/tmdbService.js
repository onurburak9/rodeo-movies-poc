const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Search for a movie on TMDB
 * @param {string} title - Movie title
 * @param {number|null} year - Release year
 * @returns {Promise<object|null>}
 */
export const searchMovie = async (title, year = null) => {
  try {
    const params = new URLSearchParams({
      api_key: process.env.TMDB_API_KEY,
      query: title,
      include_adult: 'false',
    });

    if (year) {
      params.append('year', year);
    }

    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    // Get the first result
    const movie = data.results[0];
    
    // Fetch full details
    return await getMovieDetails(movie.id);
  } catch (error) {
    console.error('TMDB Search Error:', error);
    return null;
  }
};

/**
 * Get detailed movie information
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<object|null>}
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`
    );
    const movie = await response.json();

    if (!movie || movie.success === false) {
      return null;
    }

    return {
      tmdbId: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      year: new Date(movie.release_date).getFullYear() || null,
      releaseDate: movie.release_date,
      synopsis: movie.overview,
      runtime: movie.runtime,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      posterPath: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : null,
      backdropPath: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,
      genres: movie.genres?.map(g => g.name) || [],
      cast: movie.credits?.cast?.slice(0, 5).map(c => ({
        name: c.name,
        character: c.character,
        profilePath: c.profile_path 
          ? `https://image.tmdb.org/t/p/w200${c.profile_path}` 
          : null,
      })) || [],
      director: movie.credits?.crew?.find(c => c.job === 'Director')?.name || null,
    };
  } catch (error) {
    console.error('TMDB Details Error:', error);
    return null;
  }
};

export default { searchMovie, getMovieDetails };
