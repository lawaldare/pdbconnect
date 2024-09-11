// Mock the nightingale elements to prevent issues with custom elements during testing
module.exports = {
  NightingaleManager: jest.fn(),
  NightingaleNavigation: jest.fn(),
  NightingaleSequenceHeatmap: jest.fn(),
};
