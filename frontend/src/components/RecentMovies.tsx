import { useEffect, useState } from 'react';
import { getRecentMovies } from '../services/api';

interface Screenshot {
  id: string;
  extractedTitle: string;
  extractedYear: number | null;
  confidence: string;
  createdAt: string;
  Movie?: {
    title: string;
    year: number;
    posterPath: string | null;
    rating: number;
  };
}

function RecentMovies() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentMovies();
  }, []);

  const loadRecentMovies = async () => {
    try {
      const data = await getRecentMovies();
      setScreenshots(data);
    } catch (error) {
      console.error('Failed to load recent movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Additions</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-16 h-24 bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screenshots.length === 0) {
    return (
      <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Additions</h2>
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🎬</span>
          <p className="text-gray-400">No movies added yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Upload your first screenshot to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Additions</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {screenshots.map((screenshot) => (
          <div
            key={screenshot.id}
            className="flex gap-4 p-3 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            {screenshot.Movie?.posterPath ? (
              <img
                src={screenshot.Movie.posterPath}
                alt={screenshot.Movie.title}
                className="w-16 h-24 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-24 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                🎬
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">
                {screenshot.Movie?.title || screenshot.extractedTitle}
              </h3>
              <p className="text-gray-400 text-sm">
                {screenshot.Movie?.year || screenshot.extractedYear || 'Unknown year'}
              </p>
              {screenshot.Movie?.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-gray-400 text-sm">{screenshot.Movie.rating.toFixed(1)}</span>
                </div>
              )}
              <span
                className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${
                  screenshot.confidence === 'high'
                    ? 'bg-green-900/50 text-green-400'
                    : screenshot.confidence === 'medium'
                    ? 'bg-yellow-900/50 text-yellow-400'
                    : 'bg-orange-900/50 text-orange-400'
                }`}
              >
                {screenshot.confidence}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentMovies;
