/**
 * IBAN Utilities Tests
 */
import { normalizeIban } from '../iban';

describe('IBAN Utilities', () => {
  describe('normalizeIban', () => {
    it('should convert to uppercase', () => {
      expect(normalizeIban('gb82west12345698765432')).toBe('GB82WEST12345698765432');
      expect(normalizeIban('fr1420041010050500013m02606')).toBe('FR1420041010050500013M02606');
    });

    it('should remove spaces', () => {
      expect(normalizeIban('GB82 WEST 1234 5698 7654 32')).toBe('GB82WEST12345698765432');
      expect(normalizeIban('FR14 2004 1010 0505 0001 3M02 606')).toBe('FR1420041010050500013M02606');
    });

    it('should handle mixed case with spaces', () => {
      expect(normalizeIban('gb82 west 1234 5698 7654 32')).toBe('GB82WEST12345698765432');
      expect(normalizeIban('Fr14 2004 1010 0505')).toBe('FR14200410100505');
    });

    it('should handle already normalized IBANs', () => {
      expect(normalizeIban('GB82WEST12345698765432')).toBe('GB82WEST12345698765432');
      expect(normalizeIban('FR1420041010050500013M02606')).toBe('FR1420041010050500013M02606');
    });

    it('should handle empty string', () => {
      expect(normalizeIban('')).toBe('');
    });

    it('should handle IBANs with multiple consecutive spaces', () => {
      expect(normalizeIban('GB82  WEST   1234')).toBe('GB82WEST1234');
    });

    it('should handle IBANs with leading/trailing spaces', () => {
      expect(normalizeIban(' GB82WEST1234 ')).toBe('GB82WEST1234');
      expect(normalizeIban('  GB82 WEST 1234  ')).toBe('GB82WEST1234');
    });
  });
});
