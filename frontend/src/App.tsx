import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import MovieResult from './components/MovieResult';
import RecentMovies from './components/RecentMovies';
import { analyzeImage } from './services/api';

export interface Movie {
  id: string;
  title: string;
  year: number;
  posterPath: string | null;
  rating: number;
  synopsis: string;
  runtime: number;
  genres: string[];
  cast: { name: string; character: string; profilePath: string | null }[];
  director: string | null;
}

export interface AIAnalysis {
  title: string;
  year: number | null;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  provider: 'openai' | 'gemini';
  fallbackUsed: boolean;
}

function App() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (imageBase64: string) => {
    setLoading(true);
    setError(null);
    setMovie(null);
    setAiAnalysis(null);

    try {
      const result = await analyzeImage(imageBase64);
      
      if (result.success) {
        setMovie(result.movie);
        setAiAnalysis(result.aiAnalysis);
      } else {
        setError(result.error || 'Failed to analyze image');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">📸</span>
            Rodeo Movies
          </h1>
          <p className="text-gray-400 mt-2">
            Screenshot any movie poster and we'll add it to your watchlist
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <ImageUpload onUpload={handleImageUpload} loading={loading} />
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400">{error}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Try uploading a clearer image of a movie poster or screenshot.
                </p>
              </div>
            )}

            {movie && aiAnalysis && (
              <MovieResult movie={movie} aiAnalysis={aiAnalysis} />
            )}
          </div>

          {/* Right Column - Recent */}
          <div>
            <RecentMovies />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Rodeo Movies POC • Built with OpenAI + TMDB</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
