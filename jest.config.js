const jestConfig = {
    verbose: true,
    testURL: "http://localhost/",
    'transform': {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    transform: {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
     moduleDirectories: ["node_modules", "src"],
     moduleFileExtensions: ["ts", "js", "json", "vue"]
    // testMatch: ['**/__tests__/*.js?(x)'],
  }
  
  module.exports = jestConfig