export default {
    testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/mocks/fileMock.js"
  },
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest",  // Transform JS and JSX files with babel-jest
    },
    moduleNameMapper: {
        "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/mocks/fileMock.js"
      }
  };
  