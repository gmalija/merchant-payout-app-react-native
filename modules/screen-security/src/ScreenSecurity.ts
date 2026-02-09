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