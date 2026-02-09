import * as ScreenSecurity from 'screen-security';

/**
 * Get the unique device identifier
 * @returns Device ID string or undefined if unavailable
 *
 * On iOS: Returns identifierForVendor (UUID)
 * On Android: Returns ANDROID_ID
 */
export function getDeviceId(): string | undefined {
  try {
    return ScreenSecurity.getDeviceId();
  } catch (error) {
    console.warn('Failed to get device ID:', error);
    return undefined;
  }
}
