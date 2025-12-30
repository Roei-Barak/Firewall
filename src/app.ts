import express, { Application } from 'express';
import firewallRoutes from './routes/firewallRoutes.js';
import logger from './config/logger.js';
import { connectToDb } from './database.js';
import { errorHandler } from './middleware/errorHandler.js';

// דריסת הקונסול
console.log = (...args) => logger.info(args.join(' '));
console.error = (...args) => logger.error(args.join(' '));
console.warn = (...args) => logger.warn(args.join(' '));

// 2. הגדרת הטיפוס במפורש: : Application
const app: Application = express(); 

app.use(express.json());

app.use('/api/firewall', firewallRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
};

// הרצה רק אם אנחנו לא בטסטים
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;