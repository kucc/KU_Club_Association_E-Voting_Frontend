/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',

  roots: ['<rootDir>/services', '<rootDir>/test', '<rootDir>/mocks'],

  testMatch: ['**/__tests__/**/*.test.ts'],

  moduleFileExtensions: ['ts', 'js', 'mjs', 'cjs', 'json'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  setupFiles: ['<rootDir>/test/setupEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],

  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },

  transformIgnorePatterns: ['/node_modules/.pnpm/(?!(.*)/)'],

  clearMocks: true,
};
