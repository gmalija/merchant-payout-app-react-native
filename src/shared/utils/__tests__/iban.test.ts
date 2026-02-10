/**
 * IBAN Utilities Tests
 */
import {
  normalizeIban,
  validateIban,
  validateIbanChecksum,
  validateIbanLength,
  validateIbanStructure,
} from '../iban';

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

  describe('validateIbanStructure', () => {
    it('should validate correct structure', () => {
      expect(validateIbanStructure('GB82WEST12345698765432')).toBe(true);
      expect(validateIbanStructure('FR1420041010050500013M02606')).toBe(true);
      expect(validateIbanStructure('DE89370400440532013000')).toBe(true);
    });

    it('should reject invalid country code', () => {
      expect(validateIbanStructure('1282WEST12345698765432')).toBe(false); // starts with number
      expect(validateIbanStructure('G282WEST12345698765432')).toBe(false); // only 1 letter
    });

    it('should reject invalid check digits', () => {
      expect(validateIbanStructure('GBAAWEST12345698765432')).toBe(false); // letters instead of digits
      expect(validateIbanStructure('GB8AWEST12345698765432')).toBe(false); // only 1 digit
    });

    it('should reject too short IBANs', () => {
      expect(validateIbanStructure('GB82WEST')).toBe(false); // too short
    });

    it('should reject too long IBANs', () => {
      const tooLong = 'GB82' + 'A'.repeat(35);
      expect(validateIbanStructure(tooLong)).toBe(false);
    });

    it('should reject non-alphanumeric characters', () => {
      expect(validateIbanStructure('GB82-WEST-12345698765432')).toBe(false);
      expect(validateIbanStructure('GB82_WEST_12345698765432')).toBe(false);
    });
  });

  describe('validateIbanLength', () => {
    it('should validate correct lengths for different countries', () => {
      expect(validateIbanLength('GB82WEST12345698765432')).toBe(true); // GB = 22
      expect(validateIbanLength('FR1420041010050500013M02606')).toBe(true); // FR = 27
      expect(validateIbanLength('DE89370400440532013000')).toBe(true); // DE = 22
      expect(validateIbanLength('ES9121000418450200051332')).toBe(true); // ES = 24
      expect(validateIbanLength('NL91ABNA0417164300')).toBe(true); // NL = 18
    });

    it('should reject incorrect lengths', () => {
      expect(validateIbanLength('GB82WEST123456')).toBe(false); // too short for GB
      expect(validateIbanLength('GB82WEST12345698765432123')).toBe(false); // too long for GB
      expect(validateIbanLength('DE89370400440532')).toBe(false); // too short for DE
    });

    it('should reject unknown country codes', () => {
      expect(validateIbanLength('XX82WEST12345698765432')).toBe(false);
      expect(validateIbanLength('ZZ1234567890123456')).toBe(false);
    });
  });

  describe('validateIbanChecksum', () => {
    it('should validate correct checksums', () => {
      // Valid IBANs from iban.com
      expect(validateIbanChecksum('GB82WEST12345698765432')).toBe(true);
      expect(validateIbanChecksum('FR1420041010050500013M02606')).toBe(true);
      expect(validateIbanChecksum('DE89370400440532013000')).toBe(true);
      expect(validateIbanChecksum('ES9121000418450200051332')).toBe(true);
      expect(validateIbanChecksum('IT60X0542811101000000123456')).toBe(true);
    });

    it('should reject invalid checksums', () => {
      // Same IBANs but with wrong check digits
      expect(validateIbanChecksum('GB00WEST12345698765432')).toBe(false);
      expect(validateIbanChecksum('FR0020041010050500013M02606')).toBe(false);
      expect(validateIbanChecksum('DE00370400440532013000')).toBe(false);
      expect(validateIbanChecksum('ES0021000418450200051332')).toBe(false);
    });
  });

  describe('validateIban - Comprehensive Validation', () => {
    describe('Valid IBANs', () => {
      it('should accept valid GB IBANs', () => {
        const result = validateIban('GB82 WEST 1234 5698 7654 32');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should accept valid FR IBANs', () => {
        const result = validateIban('FR14 2004 1010 0505 0001 3M02 606');
        expect(result.valid).toBe(true);
      });

      it('should accept valid DE IBANs', () => {
        const result = validateIban('DE89 3704 0044 0532 0130 00');
        expect(result.valid).toBe(true);
      });

      it('should accept valid ES IBANs', () => {
        const result = validateIban('ES91 2100 0418 4502 0005 1332');
        expect(result.valid).toBe(true);
      });

      it('should accept valid IT IBANs', () => {
        const result = validateIban('IT60 X054 2811 1010 0000 0123 456');
        expect(result.valid).toBe(true);
      });

      it('should accept valid NL IBANs', () => {
        const result = validateIban('NL91 ABNA 0417 1643 00');
        expect(result.valid).toBe(true);
      });
    });

    describe('Invalid IBANs - Structure', () => {
      it('should reject IBANs with invalid structure', () => {
        const result = validateIban('1234567890');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid IBAN format');
      });

      it('should reject IBANs starting with numbers', () => {
        const result = validateIban('12WEST12345698765432');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid IBAN format');
      });

      it('should reject IBANs with special characters', () => {
        const result = validateIban('GB82-WEST-12345698765432');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid IBAN format');
      });
    });

    describe('Invalid IBANs - Length', () => {
      it('should reject IBANs that are too short', () => {
        // GB requires 22 chars, this has only 18 (structure valid but too short)
        const result = validateIban('GB82WEST1234567890');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid IBAN length');
      });

      it('should reject IBANs that are too long for country', () => {
        const result = validateIban('GB82WEST12345698765432123456789');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid IBAN length');
      });

      it('should reject unknown country codes', () => {
        const result = validateIban('XX82WEST12345698765432');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Unknown country code');
      });
    });

    describe('Invalid IBANs - Checksum (from iban.com/testibans)', () => {
      it('should reject GB IBAN with invalid checksum', () => {
        // GB with check digits 00 (invalid)
        const result = validateIban('GB00WEST12345698765432');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid IBAN checksum');
      });

      it('should reject FR IBAN with invalid checksum', () => {
        // FR with check digits 00 (invalid)
        const result = validateIban('FR0020041010050500013M02606');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid IBAN checksum');
      });

      it('should reject DE IBAN with invalid checksum', () => {
        // DE with check digits 00 (invalid)
        const result = validateIban('DE00370400440532013000');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid IBAN checksum');
      });

      it('should reject ES IBAN with invalid checksum', () => {
        // ES with check digits 00 (invalid)
        const result = validateIban('ES0021000418450200051332');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid IBAN checksum');
      });

      it('should reject modified valid IBAN (changed one digit)', () => {
        // GB82 changed to GB83
        const result = validateIban('GB83WEST12345698765432');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid IBAN checksum');
      });

      it('should reject modified valid IBAN (changed account number)', () => {
        // Last digit changed from 2 to 3
        const result = validateIban('GB82WEST12345698765433');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid IBAN checksum');
      });
    });

    describe('Edge Cases', () => {
      it('should handle IBANs with spaces correctly', () => {
        const result1 = validateIban('GB82 WEST 1234 5698 7654 32');
        const result2 = validateIban('GB82WEST12345698765432');
        expect(result1.valid).toBe(true);
        expect(result2.valid).toBe(true);
      });

      it('should handle lowercase IBANs', () => {
        const result = validateIban('gb82west12345698765432');
        expect(result.valid).toBe(true);
      });

      it('should handle mixed case IBANs', () => {
        const result = validateIban('Gb82WeSt12345698765432');
        expect(result.valid).toBe(true);
      });

      it('should reject empty string', () => {
        const result = validateIban('');
        expect(result.valid).toBe(false);
      });
    });
  });
});
