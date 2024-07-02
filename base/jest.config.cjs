module.exports = {
  "transform": {
    "^.+\\.ts?$": "ts-jest"
  },
  "testEnvironment": "node",
  "moduleFileExtensions": ["js", "ts"],
  "globals": {
    "ts-jest": {
      "useESM": true
    }
  },
  "testMatch": ["**/test/**/*.test.ts"]
};