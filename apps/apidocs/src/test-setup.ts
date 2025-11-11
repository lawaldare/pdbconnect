// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Mock Clarity globally so Jest doesn’t choke on ESM import
jest.mock('@microsoft/clarity', () => ({
  init: jest.fn(),
  consent: jest.fn(),
}));

setupZoneTestEnv();
