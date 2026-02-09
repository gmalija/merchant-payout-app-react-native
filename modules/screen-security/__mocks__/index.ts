/**
 * Mock ScreenSecurity Module
 * Used for testing
 */

export interface ScreenshotSubscription {
  remove: () => void;
}

export const getDeviceId = jest.fn(() => 'mock-device-id-12345');

export const isBiometricAuthenticated = jest.fn(async () => true);