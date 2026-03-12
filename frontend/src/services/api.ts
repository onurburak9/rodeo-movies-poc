const API_BASE = '/api';

export const analyzeImage = async (imageBase64: string) => {
  const response = await fetch(`${API_BASE}/movies/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageBase64 }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze image');
  }

  return response.json();
};

export const getRecentMovies = async () => {
  const response = await fetch(`${API_BASE}/movies/recent`);
  if (!response.ok) throw new Error('Failed to load recent movies');
  return response.json();
};

export const searchMovies = async (query: string) => {
  const response = await fetch(`${API_BASE}/movies/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
};

export const getMovie = async (id: string) => {
  const response = await fetch(`${API_BASE}/movies/${id}`);
  if (!response.ok) throw new Error('Movie not found');
  return response.json();
};
