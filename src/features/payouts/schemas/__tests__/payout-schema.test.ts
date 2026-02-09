/**
 * Payout Schema Validation Tests
 */
import {
  currencySchema,
  amountSchema,
  amountInputSchema,
  ibanSchema,
  payoutFormSchema,
  payoutFormInputSchema,
  validateField,
  validatePayoutForm,
} from '../payout-schema';

describe('Payout Validation Schemas', () => {
  describe('currencySchema', () => {
    it('should accept GBP', () => {
      expect(currencySchema.parse('GBP')).toBe('GBP');
    });

    it('should accept EUR', () => {
      expect(currencySchema.parse('EUR')).toBe('EUR');
    });

    it('should reject invalid currencies', () => {
      expect(() => currencySchema.parse('USD')).toThrow();
      expect(() => currencySchema.parse('JPY')).toThrow();
    });
  });

  describe('amountSchema', () => {
    it('should accept valid positive amounts', () => {
      expect(amountSchema.parse(10)).toBe(10);
      expect(amountSchema.parse(100.5)).toBe(100.5);
      expect(amountSchema.parse(1000.99)).toBe(1000.99);
    });

    it('should accept amounts with 2 decimal places', () => {
      expect(amountSchema.parse(10.99)).toBe(10.99);
      expect(amountSchema.parse(100.01)).toBe(100.01);
    });

    it('should reject zero', () => {
      expect(() => amountSchema.parse(0)).toThrow('Amount must be greater than 0');
    });

    it('should reject negative amounts', () => {
      expect(() => amountSchema.parse(-10)).toThrow('Amount must be greater than 0');
    });

    it('should reject amounts with more than 2 decimal places', () => {
      expect(() => amountSchema.parse(10.999)).toThrow('Amount can only have up to 2 decimal places');
      expect(() => amountSchema.parse(10.001)).toThrow('Amount can only have up to 2 decimal places');
    });

    it('should reject amounts exceeding max', () => {
      expect(() => amountSchema.parse(1000001)).toThrow('Amount cannot exceed');
    });
  });

  describe('amountInputSchema', () => {
    it('should transform valid string amounts to numbers', () => {
      expect(amountInputSchema.parse('10')).toBe(10);
      expect(amountInputSchema.parse('100.5')).toBe(100.5);
      expect(amountInputSchema.parse('1000.99')).toBe(1000.99);
    });

    it('should reject empty strings', () => {
      expect(() => amountInputSchema.parse('')).toThrow('Amount is required');
    });

    it('should reject non-numeric strings', () => {
      expect(() => amountInputSchema.parse('abc')).toThrow('Amount must be a valid number');
    });

    it('should reject zero', () => {
      expect(() => amountInputSchema.parse('0')).toThrow('Amount must be greater than 0');
    });

    it('should reject negative amounts', () => {
      expect(() => amountInputSchema.parse('-10')).toThrow('Amount must be greater than 0');
    });

    it('should reject amounts with more than 2 decimal places', () => {
      expect(() => amountInputSchema.parse('10.999')).toThrow(
        'Amount can only have up to 2 decimal places'
      );
    });
  });

  describe('ibanSchema', () => {
    it('should accept valid IBANs', () => {
      const validIbans = [
        'GB82WEST12345698765432',
        'FR1420041010050500013M02606',
        'DE89370400440532013000',
        'ES9121000418450200051332',
      ];

      validIbans.forEach((iban) => {
        expect(ibanSchema.parse(iban)).toBe(iban);
      });
    });

    it('should normalize IBANs to uppercase without spaces', () => {
      expect(ibanSchema.parse('gb82 west 1234 5698 7654 32')).toBe('GB82WEST12345698765432');
      expect(ibanSchema.parse('gb82west12345698765432')).toBe('GB82WEST12345698765432');
    });

    it('should reject IBANs that are too short', () => {
      expect(() => ibanSchema.parse('GB82WEST')).toThrow('IBAN must be at least 15 characters');
    });

    it('should reject IBANs that are too long', () => {
      const longIban = 'GB82' + 'A'.repeat(35);
      expect(() => ibanSchema.parse(longIban)).toThrow('IBAN must be at most 34 characters');
    });

    it('should reject IBANs with invalid format', () => {
      expect(() => ibanSchema.parse('1234567890123456')).toThrow('Invalid IBAN format');
      expect(() => ibanSchema.parse('GBAAWEST12345698765432')).toThrow('Invalid IBAN format');
      expect(() => ibanSchema.parse('G282WEST12345698765432')).toThrow('Invalid IBAN format');
    });

    it('should reject IBANs with special characters', () => {
      expect(() => ibanSchema.parse('GB82-WEST-12345698765432')).toThrow('Invalid IBAN format');
      expect(() => ibanSchema.parse('GB82_WEST_12345698765432')).toThrow('Invalid IBAN format');
    });
  });

  describe('payoutFormSchema', () => {
    it('should accept valid complete forms', () => {
      const validForm = {
        amount: 100.5,
        currency: 'GBP' as const,
        iban: 'GB82WEST12345698765432',
      };

      expect(payoutFormSchema.parse(validForm)).toEqual(validForm);
    });

    it('should reject forms with missing fields', () => {
      expect(() =>
        payoutFormSchema.parse({
          amount: 100,
          currency: 'GBP',
        })
      ).toThrow();

      expect(() =>
        payoutFormSchema.parse({
          amount: 100,
          iban: 'GB82WEST12345698765432',
        })
      ).toThrow();

      expect(() =>
        payoutFormSchema.parse({
          currency: 'GBP',
          iban: 'GB82WEST12345698765432',
        })
      ).toThrow();
    });

    it('should reject forms with invalid field values', () => {
      expect(() =>
        payoutFormSchema.parse({
          amount: -100,
          currency: 'GBP',
          iban: 'GB82WEST12345698765432',
        })
      ).toThrow();

      expect(() =>
        payoutFormSchema.parse({
          amount: 100,
          currency: 'USD',
          iban: 'GB82WEST12345698765432',
        })
      ).toThrow();

      expect(() =>
        payoutFormSchema.parse({
          amount: 100,
          currency: 'GBP',
          iban: 'INVALID',
        })
      ).toThrow();
    });
  });

  describe('payoutFormInputSchema', () => {
    it('should transform and validate string inputs', () => {
      const result = payoutFormInputSchema.parse({
        amount: '100.5',
        currency: 'GBP',
        iban: 'gb82 west 1234 5698 7654 32',
      });

      expect(result).toEqual({
        amount: 100.5,
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
      });
    });

    it('should reject invalid string inputs', () => {
      expect(() =>
        payoutFormInputSchema.parse({
          amount: 'abc',
          currency: 'GBP',
          iban: 'GB82WEST12345698765432',
        })
      ).toThrow();

      expect(() =>
        payoutFormInputSchema.parse({
          amount: '100',
          currency: 'GBP',
          iban: 'INVALID',
        })
      ).toThrow();
    });
  });

  describe('validateField', () => {
    it('should validate amount field', () => {
      expect(validateField('amount', 100)).toEqual({ success: true });
      expect(validateField('amount', -100)).toEqual({
        success: false,
        error: 'Amount must be greater than 0',
      });
    });

    it('should validate currency field', () => {
      expect(validateField('currency', 'GBP')).toEqual({ success: true });
      expect(validateField('currency', 'USD')).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should validate iban field', () => {
      expect(validateField('iban', 'GB82WEST12345698765432')).toEqual({ success: true });
      expect(validateField('iban', 'INVALID')).toEqual({
        success: false,
        error: expect.any(String),
      });
    });
  });

  describe('validatePayoutForm', () => {
    it('should validate complete valid forms', () => {
      const result = validatePayoutForm({
        amount: 100.5,
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        amount: 100.5,
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
      });
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid forms', () => {
      const result = validatePayoutForm({
        amount: -100,
        currency: 'USD',
        iban: 'INVALID',
      });

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(result.errors?.amount).toBeDefined();
      expect(result.errors?.currency).toBeDefined();
      expect(result.errors?.iban).toBeDefined();
    });

    it('should return only first error per field', () => {
      const result = validatePayoutForm({
        amount: -100.999, // Multiple errors: negative AND too many decimals
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
      });

      expect(result.success).toBe(false);
      expect(result.errors?.amount).toBeDefined();
      // Should only have one error message, not multiple
      expect(typeof result.errors?.amount).toBe('string');
    });
  });
});
