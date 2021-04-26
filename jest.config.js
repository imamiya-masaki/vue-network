const jestConfig = {
    verbose: true,
    testURL: "http://localhost/",
    'transform': {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    transform: {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
    output: {
        // ...
        // ソースマップで絶対パスを使用する（IDE 経由のデバッグで重要）
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
     },
     devtool: 'inline-cheap-module-source-map',
     moduleDirectories: ["node_modules", "src"],
     moduleFileExtensions: ["ts", "js", "json", "vue"]
    // testMatch: ['**/__tests__/*.js?(x)'],
  }
  
  module.exports = jestConfig