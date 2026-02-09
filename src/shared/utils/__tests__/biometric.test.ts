/**
 * Biometric Utilities Tests
 */
import {
  authenticateWithBiometrics,
  BiometricErrorType,
} from '../biometric';
import * as ScreenSecurity from 'screen-security';

// Mock the native module with inline implementation
jest.mock('screen-security', () => ({
  getDeviceId: jest.fn(() => 'mock-device-id-12345'),
  isBiometricAuthenticated: jest.fn(),
}));

describe('Biometric Utilities', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('authenticateWithBiometrics', () => {
    it('should return success when authentication succeeds', async () => {
      (ScreenSecurity.isBiometricAuthenticated as jest.Mock).mockResolvedValue(
        true
      );

      const result = await authenticateWithBiometrics();

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(ScreenSecurity.isBiometricAuthenticated).toHaveBeenCalled();
    });

    it('should return success false when authentication is cancelled', async () => {
      (ScreenSecurity.isBiometricAuthenticated as jest.Mock).mockResolvedValue(
        false
      );

      const result = await authenticateWithBiometrics();

      expect(result.success).toBe(false);
      expect(result.error).toBeUndefined();
    });

    it('should handle NOT_ENROLLED error', async () => {
      const error = new Error('Not enrolled');
      (error as any).code = 'BIOMETRICS_NOT_ENROLLED';
      (ScreenSecurity.isBiometricAuthenticated as jest.Mock).mockRejectedValue(
        error
      );

      const result = await authenticateWithBiometrics();

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe(BiometricErrorType.NOT_ENROLLED);
      expect(result.error?.message).toContain('not set up');
    });

    it('should handle NOT_AVAILABLE error', async () => {
      const error = new Error('Not available');
      (error as any).code = 'BIOMETRICS_NOT_AVAILABLE';
      (ScreenSecurity.isBiometricAuthenticated as jest.Mock).mockRejectedValue(
        error
      );

      const result = await authenticateWithBiometrics();

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe(BiometricErrorType.NOT_AVAILABLE);
      expect(result.error?.message).toContain('not available');
    });

    it('should handle AUTH_FAILED error', async () => {
      const error = new Error('Authentication failed');
      (error as any).code = 'BIOMETRICS_AUTH_FAILED';
      (ScreenSecurity.isBiometricAuthenticated as jest.Mock).mockRejectedValue(
        error
      );

      const result = await authenticateWithBiometrics();

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe(BiometricErrorType.AUTH_FAILED);
      expect(result.error?.message).toBe('Authentication failed');
    });

    it('should handle unknown errors', async () => {
      const error = new Error('Unknown error');
      (ScreenSecurity.isBiometricAuthenticated as jest.Mock).mockRejectedValue(
        error
      );

      const result = await authenticateWithBiometrics();

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe(BiometricErrorType.UNKNOWN);
      expect(result.error?.message).toBe('Unknown error');
    });
  });
});
