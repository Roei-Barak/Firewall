import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres'; // הייבוא החדש
import * as schema from './types/schema.js';
import dotenv from 'dotenv';
import logger from './config/logger.js';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// --- הוספנו את זה: יצירת מופע של Drizzle ---
const db = drizzle(pool, { schema }); 
// ------------------------------------------

// פונקציית ה-Stop and Wait נשארת אותו דבר (רק לטובת הלוגיקה של החיבור)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const connectToDb = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      logger.info('Successfully connected to PostgreSQL database! 🚀');
      return;
    } catch (err: any) {
      const interval = parseInt(process.env.DB_CONNECTION_INTERVAL || '5000');
      logger.error(`Database connection failed: ${err.message}`);
      logger.warn(`Retrying in ${interval / 1000} seconds... (Retries left: ${retries})`);
      retries -= 1;
      await wait(interval);
    }
  }
  process.exit(1);
};

// שים לב: אנחנו מייצאים עכשיו גם את db (של דריזל) וגם את pool
export { pool, connectToDb, db };
export default db; // ברירת המחדל היא עכשיו db של דריזל