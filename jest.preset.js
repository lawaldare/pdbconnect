const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,

  // mocks for external libs
  moduleNameMapper: {
    '^@nightingale-elements/(.*)$': '<rootDir>/__mocks__/nightingale-elements.mock.js',
    '^d3$': '<rootDir>/__mocks__/d3.mock.js',
  },
};
