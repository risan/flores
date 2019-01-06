module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/fixtures/"],
  verbose: true,
  resetMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js"]
};
