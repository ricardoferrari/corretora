'use strict';
module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The test environment that will be used for testing
  testEnvironment: 'node',

  testMatch: [
    "**/__tests__/**/*.(spec|test).[jt]s?(x)",
  ],

  testPathIgnorePatterns: [
    "interface/"
  ],

};
