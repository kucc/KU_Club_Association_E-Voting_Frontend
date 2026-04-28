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
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    ],
    '^.+\\.mjs$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    ],
  },

  transformIgnorePatterns: ['/node_modules/.pnpm/(?!(.*)/)'],

  clearMocks: true,
};
