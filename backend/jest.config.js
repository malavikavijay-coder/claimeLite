module.exports = {
  testEnvironment: "node",
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "routes/**/*.js",
    "models/**/*.js",
    "app.js",
    "!**/node_modules/**",
    "!server.js"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"]
};
