import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tmdbId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalTitle: {
    type: DataTypes.STRING,
  },
  year: {
    type: DataTypes.INTEGER,
  },
  releaseDate: {
    type: DataTypes.DATEONLY,
  },
  synopsis: {
    type: DataTypes.TEXT,
  },
  runtime: {
    type: DataTypes.INTEGER,
  },
  rating: {
    type: DataTypes.FLOAT,
  },
  voteCount: {
    type: DataTypes.INTEGER,
  },
  posterPath: {
    type: DataTypes.STRING,
  },
  backdropPath: {
    type: DataTypes.STRING,
  },
  genres: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  cast: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  director: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'movies',
  timestamps: true,
});

const Screenshot = sequelize.define('Screenshot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  extractedTitle: {
    type: DataTypes.STRING,
  },
  extractedYear: {
    type: DataTypes.INTEGER,
  },
  confidence: {
    type: DataTypes.STRING,
  },
  movieId: {
    type: DataTypes.UUID,
    references: {
      model: Movie,
      key: 'id',
    },
  },
}, {
  tableName: 'screenshots',
  timestamps: true,
});

// Define associations
Screenshot.belongsTo(Movie, { foreignKey: 'movieId' });
Movie.hasMany(Screenshot, { foreignKey: 'movieId' });

export { Movie, Screenshot };
