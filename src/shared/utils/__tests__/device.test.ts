/**
 * Device Utilities Tests
 */
import { getDeviceId } from '../device';
import * as ScreenSecurity from 'screen-security';

// Mock the native module
jest.mock('screen-security');

describe('Device Utilities', () => {
  describe('getDeviceId', () => {
    it('should return device ID from native module', () => {
      const mockDeviceId = 'test-device-123';
      (ScreenSecurity.getDeviceId as jest.Mock).mockReturnValue(mockDeviceId);

      const result = getDeviceId();

      expect(result).toBe(mockDeviceId);
      expect(ScreenSecurity.getDeviceId).toHaveBeenCalled();
    });

    it('should return undefined if native module throws error', () => {
      (ScreenSecurity.getDeviceId as jest.Mock).mockImplementation(() => {
        throw new Error('Native module error');
      });

      // Suppress console.warn in tests
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = getDeviceId();

      expect(result).toBeUndefined();
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to get device ID:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle native module unavailable', () => {
      (ScreenSecurity.getDeviceId as jest.Mock).mockImplementation(() => {
        throw new Error('Module not available');
      });

      // Suppress console.warn in tests
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = getDeviceId();

      expect(result).toBeUndefined();

      consoleSpy.mockRestore();
    });
  });
});