module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': [
      'esbuild-jest',
      {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        sourcemap: true,
        target: 'es2020',
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!lodash.)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/**/*.test.(js|jsx|ts|tsx)'],
};
