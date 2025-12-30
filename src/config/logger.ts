// src/utils/logger.ts
import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config();

// הגדרת צבעים לדרגות החומרה השונות (רק ל-Dev)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// פורמט בסיסי: זמן + הודעה
const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// הגדרת ה-Transports (לאן הלוג נשלח)
const transports = [];

if (process.env.ENV === 'development') {
  // בפיתוח: צבעוני ויפה לקונסול
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        baseFormat
      ),
    })
  );
} else {
  // בפרודקשן: שמירה לקבצים
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

// יצירת הלוגר
const logger = winston.createLogger({
  level: process.env.ENV === 'development' ? 'debug' : 'info',
  transports,
});

export default logger;