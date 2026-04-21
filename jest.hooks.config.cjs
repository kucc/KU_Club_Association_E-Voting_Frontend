/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',

  roots: ['<rootDir>/hooks', '<rootDir>/test'],

  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  setupFiles: ['<rootDir>/test/setupEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setupHooks.ts'],

  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },

  transformIgnorePatterns: ['/node_modules/.pnpm/(?!(.*)/)'],

  clearMocks: true,
};
