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
