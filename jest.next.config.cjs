const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',

  roots: ['<rootDir>/app', '<rootDir>/components', '<rootDir>/test'],

  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  setupFilesAfterEnv: ['<rootDir>/test/setupUi.ts'],

  clearMocks: true,
};

module.exports = createJestConfig(customJestConfig);
