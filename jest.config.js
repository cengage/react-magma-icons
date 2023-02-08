const name = __dirname.split('/').pop();

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [`src/**/*.{js,jsx,ts,tsx}`],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  displayName: {
    name,
    color: 'yellow',
  },
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  testMatch: [`**/?(*.)+(spec|test).{js,ts,mjs}`],
  testPathIgnorePatterns: [
    '/.cache/',
    '/coverage/',
    '/node_modules/',
    '/public/',
    '/reports/',
    '/static/',
    '/dist/',
  ],
  transform: {
    '^.+\\.(j|t)s(x)?$': ['babel-jest', { cwd: __dirname }],
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
