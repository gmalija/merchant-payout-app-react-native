/**
 * Screen Security Module
 * Native module for screen security and device identification
 */
import { requireNativeModule } from 'expo-modules-core';

// Lazy-load the native module to avoid loading errors
let ScreenSecurityModule: any = null;

function getNativeModule() {
  if (!ScreenSecurityModule) {
    ScreenSecurityModule = requireNativeModule('ScreenSecurity');
  }
  return ScreenSecurityModule;
}

/**
 * Get the unique device identifier
 * @returns A unique string identifier for the device
 *
 * On iOS: Returns identifierForVendor (UUID)
 * On Android: Returns ANDROID_ID (unique per device+app combination)
 *
 * @example
 * ```typescript
 * import * as ScreenSecurity from 'screen-security';
 *
 * const deviceId = ScreenSecurity.getDeviceId();
 * console.log('Device ID:', deviceId);
 * ```
 */
export function getDeviceId(): string {
  return getNativeModule().getDeviceId();
}

/**
 * Authenticate user with biometric authentication
 * @returns Promise that resolves to true if authentication succeeds, false if cancelled
 * @throws Error if biometrics are not available or not enrolled
 *
 * On iOS: Uses Face ID or Touch ID
 * On Android: Uses Fingerprint or Face authentication
 *
 * @example
 * ```typescript
 * import * as ScreenSecurity from 'screen-security';
 *
 * try {
 *   const authenticated = await ScreenSecurity.isBiometricAuthenticated();
 *   if (authenticated) {
 *     console.log('Authentication successful');
 *   } else {
 *     console.log('Authentication cancelled');
 *   }
 * } catch (error) {
 *   console.error('Biometric authentication failed:', error);
 * }
 * ```
 */
export function isBiometricAuthenticated(): Promise<boolean> {
  return getNativeModule().isBiometricAuthenticated();
}