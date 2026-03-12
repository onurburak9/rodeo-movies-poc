import type { Movie, AIAnalysis } from '../App';

interface MovieResultProps {
  movie: Movie;
  aiAnalysis: AIAnalysis;
}

function MovieResult({ movie, aiAnalysis }: MovieResultProps) {
  const confidenceColor = {
    high: 'text-green-400',
    medium: 'text-yellow-400',
    low: 'text-orange-400',
  }[aiAnalysis.confidence];

  const providerLabel = aiAnalysis.provider === 'openai' ? 'GPT-4o-mini' : 'Gemini';
  const sourceLabel = aiAnalysis.source.charAt(0).toUpperCase() + aiAnalysis.source.slice(1);

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-900/50 to-green-800/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-sm font-medium flex items-center gap-2">
            <span>✓</span> Movie Identified
          </span>
          {aiAnalysis.fallbackUsed && (
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full" title="OpenAI confidence was low, used Gemini as fallback">
              🤖 Fallback
            </span>
          )}
        </div>
        <span className={`text-xs font-medium ${confidenceColor}`}>
          {aiAnalysis.confidence} confidence
        </span>
      </div>

      <div className="p-6">
        <div className="flex gap-6">
          {/* Poster */}
          <div className="flex-shrink-0">
            {movie.posterPath ? (
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-40 rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-40 h-60 bg-gray-700 rounded-lg flex items-center justify-center text-4xl">
                🎬
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white mb-1">{movie.title}</h2>
            <p className="text-gray-400 mb-4">
              {movie.year} • {formatRuntime(movie.runtime)}
            </p>

            {movie.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-white font-semibold">{movie.rating.toFixed(1)}</span>
                <span className="text-gray-500">/10</span>
              </div>
            )}

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {movie.director && (
              <p className="text-gray-400 text-sm mb-4">
                Directed by <span className="text-white">{movie.director}</span>
              </p>
            )}
          </div>
        </div>

        {/* Synopsis */}
        {movie.synopsis && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Synopsis
            </h3>
            <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
          </div>
        )}

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Cast
            </h3>
            <div className="flex flex-wrap gap-3">
              {movie.cast.map((actor) => (
                <div key={actor.name} className="flex items-center gap-2 bg-gray-700/50 rounded-full pr-3">
                  {actor.profilePath ? (
                    <img
                      src={actor.profilePath}
                      alt={actor.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                      👤
                    </div>
                  )}
                  <div>
                    <p className="text-white text-sm">{actor.name}</p>
                    <p className="text-gray-500 text-xs">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Analysis Info */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>Analyzed by <span className="text-gray-400">{providerLabel}</span></span>
              <span>•</span>
              <span>Source: <span className="text-gray-400">{sourceLabel}</span></span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-700 flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-colors">
            Add to Watchlist
          </button>
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
            Mark as Watched
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieResult;
