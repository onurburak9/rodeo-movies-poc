import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://localhost:5432/rodeo_movies',
  {
    dialect: 'postgres',
    logging: false,
  }
);

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('Continuing without database persistence...');
  }
};

export default sequelize;
