import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  verbose: true,
  forceExit: true,     // סוגר חיבורים ל-DB בסוף
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // מטפל בייבוא קבצים עם סיומת .js בתוך הקוד
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // כאן הקסם קורה:
        tsconfig: {
          module: 'commonjs',     // מריץ את הטסטים כ-CommonJS
          esModuleInterop: true,  // ✅ זה הדגל שפותר את ה-Default Import
        },
      },
    ],
  },
};

export default config;