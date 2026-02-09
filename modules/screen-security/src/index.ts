import ScreenSecurityModule from './ScreenSecurityModule';

/**
 * Get the unique device identifier
 */
export function getDeviceId(): string {
  return ScreenSecurityModule.getDeviceId();
}

/**
 * Authenticate user with biometric authentication
 * @returns Promise that resolves to true if authentication succeeds, false if cancelled
 * @throws Error if biometrics are not available or not enrolled
 */
export function isBiometricAuthenticated(): Promise<boolean> {
  return ScreenSecurityModule.isBiometricAuthenticated();
}