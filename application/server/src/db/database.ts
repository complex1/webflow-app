import { DataSource } from 'typeorm';
import path from 'path';
import { UserEntity } from '../entities/user.entity';

// Create data directory if it doesn't exist
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'database.sqlite');

// Configure the database connection
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: DB_PATH,
  entities: [UserEntity],
  synchronize: true, // Automatically creates database schema (use only in development)
  logging: process.env.NODE_ENV === 'development',
});

// Database connection functions
let initialized = false;

export const initDB = async (): Promise<DataSource> => {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
    console.log('Database connection established');
  }
  return AppDataSource;
};

export const getDB = async (): Promise<DataSource> => {
  if (!initialized) {
    return initDB();
  }
  return AppDataSource;
};

export const closeDB = async (): Promise<void> => {
  if (initialized && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    initialized = false;
    console.log('Database connection closed');
  }
};