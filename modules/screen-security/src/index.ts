import ScreenSecurityModule from './ScreenSecurityModule';

/**
 * Get the unique device identifier
 */
export function getDeviceId(): string {
  return ScreenSecurityModule.getDeviceId();
}