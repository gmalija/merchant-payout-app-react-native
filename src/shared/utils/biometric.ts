/**
 * Biometric Authentication Utilities
 * Wrapper around native ScreenSecurity module
 */
import * as ScreenSecurity from 'screen-security';

/**
 * Error types for biometric authentication
 */
export enum BiometricErrorType {
  NOT_ENROLLED = 'BIOMETRICS_NOT_ENROLLED',
  NOT_AVAILABLE = 'BIOMETRICS_NOT_AVAILABLE',
  AUTH_FAILED = 'BIOMETRICS_AUTH_FAILED',
  CANCELLED = 'CANCELLED',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Result of biometric authentication attempt
 */
export interface BiometricAuthResult {
  success: boolean;
  error?: {
    type: BiometricErrorType;
    message: string;
  };
}

/**
 * Authenticate user with biometric authentication (Face ID, Touch ID, Fingerprint)
 * @returns Promise with authentication result
 *
 * @example
 * ```typescript
 * const result = await authenticateWithBiometrics();
 * if (result.success) {
 *   // Proceed with action
 * } else if (result.error?.type === BiometricErrorType.NOT_ENROLLED) {
 *   // Show message to enable biometrics in settings
 * } else if (result.error?.type === BiometricErrorType.CANCELLED) {
 *   // User cancelled
 * }
 * ```
 */
export async function authenticateWithBiometrics(): Promise<BiometricAuthResult> {
  try {
    const authenticated = await ScreenSecurity.isBiometricAuthenticated();
    return { success: authenticated };
  } catch (error: any) {
    const errorCode = error?.code || 'UNKNOWN';
    const errorMessage = error?.message || 'Biometric authentication failed';

    if (errorCode === 'BIOMETRICS_NOT_ENROLLED') {
      return {
        success: false,
        error: {
          type: BiometricErrorType.NOT_ENROLLED,
          message:
            'Biometric authentication is not set up. Please enable Face ID, Touch ID, or Fingerprint in your device Settings.',
        },
      };
    }

    if (errorCode === 'BIOMETRICS_NOT_AVAILABLE') {
      return {
        success: false,
        error: {
          type: BiometricErrorType.NOT_AVAILABLE,
          message: 'Biometric authentication is not available on this device.',
        },
      };
    }

    if (errorCode === 'BIOMETRICS_AUTH_FAILED') {
      return {
        success: false,
        error: {
          type: BiometricErrorType.AUTH_FAILED,
          message: errorMessage,
        },
      };
    }

    // Treat any other error as unknown
    return {
      success: false,
      error: {
        type: BiometricErrorType.UNKNOWN,
        message: errorMessage,
      },
    };
  }
}
