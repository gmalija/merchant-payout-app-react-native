/**
 * Mock ScreenSecurity Module
 * Used for testing
 */

export interface ScreenshotSubscription {
  remove: () => void;
}

export function getDeviceId(): string {
  return 'mock-device-id-12345';
}

export async function isBiometricAuthenticated(): Promise<boolean> {
  return true;
}