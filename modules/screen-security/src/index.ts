/**
 * Screen Security Module - Public API
 * Re-exports all functions and types from the main module
 */
export {
  getDeviceId,
  isBiometricAuthenticated,
  addScreenshotListener,
  type ScreenshotSubscription,
} from './ScreenSecurity';