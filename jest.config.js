export default {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'test'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
};
