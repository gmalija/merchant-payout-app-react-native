import {
  fromLowestDenomination,
  toLowestDenomination,
  formatCurrency,
  getCurrencySymbol,
} from '../currency';

describe('Currency Utilities', () => {
  describe('fromLowestDenomination', () => {
    it('converts pence to pounds correctly', () => {
      expect(fromLowestDenomination(500000)).toBe(5000);
      expect(fromLowestDenomination(100)).toBe(1);
      expect(fromLowestDenomination(0)).toBe(0);
      expect(fromLowestDenomination(-50000)).toBe(-500);
    });
  });

  describe('toLowestDenomination', () => {
    it('converts pounds to pence correctly', () => {
      expect(toLowestDenomination(5000)).toBe(500000);
      expect(toLowestDenomination(1)).toBe(100);
      expect(toLowestDenomination(0)).toBe(0);
      expect(toLowestDenomination(-500)).toBe(-50000);
    });

    it('rounds fractional values correctly', () => {
      expect(toLowestDenomination(1.234)).toBe(123);
      expect(toLowestDenomination(1.235)).toBe(124);
    });
  });

  describe('formatCurrency', () => {
    it('formats GBP in lowest denomination correctly (default)', () => {
      expect(formatCurrency(500000, 'GBP')).toBe('£5,000.00');
      expect(formatCurrency(100, 'GBP')).toBe('£1.00');
      expect(formatCurrency(0, 'GBP')).toBe('£0.00');
      expect(formatCurrency(12345, 'GBP')).toBe('£123.45');
    });

    it('formats GBP in major unit correctly', () => {
      expect(formatCurrency(5000, 'GBP', false)).toBe('£5,000.00');
      expect(formatCurrency(1, 'GBP', false)).toBe('£1.00');
      expect(formatCurrency(0, 'GBP', false)).toBe('£0.00');
      expect(formatCurrency(123.45, 'GBP', false)).toBe('£123.45');
      expect(formatCurrency(1234, 'GBP', false)).toBe('£1,234.00');
    });

    it('formats EUR correctly', () => {
      expect(formatCurrency(500000, 'EUR')).toBe('€5,000.00');
      expect(formatCurrency(100, 'EUR')).toBe('€1.00');
      expect(formatCurrency(0, 'EUR')).toBe('€0.00');
    });

    it('formats EUR in major unit correctly', () => {
      expect(formatCurrency(5000, 'EUR', false)).toBe('€5,000.00');
      expect(formatCurrency(1234, 'EUR', false)).toBe('€1,234.00');
    });

    it('formats negative amounts correctly', () => {
      expect(formatCurrency(-50000, 'GBP')).toBe('-£500.00');
      expect(formatCurrency(-100, 'EUR')).toBe('-€1.00');
      expect(formatCurrency(-1234, 'GBP', false)).toBe('-£1,234.00');
    });

    it('formats large amounts with commas', () => {
      expect(formatCurrency(123456789, 'GBP')).toBe('£1,234,567.89');
      expect(formatCurrency(1234567.89, 'GBP', false)).toBe('£1,234,567.89');
    });
  });

  describe('getCurrencySymbol', () => {
    it('returns correct symbol for GBP', () => {
      expect(getCurrencySymbol('GBP')).toBe('£');
    });

    it('returns correct symbol for EUR', () => {
      expect(getCurrencySymbol('EUR')).toBe('€');
    });
  });
});
