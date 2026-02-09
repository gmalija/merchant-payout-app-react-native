import { formatDate } from '../date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('formats date as DD Mon YYYY', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('15 Jan 2024');
      expect(formatDate('2024-12-31T23:59:59Z')).toBe('31 Dec 2024');
      expect(formatDate('2024-07-04T00:00:00Z')).toBe('4 Jul 2024');
    });

    it('formats single digit days without padding', () => {
      expect(formatDate('2024-01-01T00:00:00Z')).toBe('1 Jan 2024');
      expect(formatDate('2024-09-05T00:00:00Z')).toBe('5 Sep 2024');
    });

    it('formats all months correctly', () => {
      expect(formatDate('2024-02-15T00:00:00Z')).toBe('15 Feb 2024');
      expect(formatDate('2024-03-15T00:00:00Z')).toBe('15 Mar 2024');
      expect(formatDate('2024-04-15T00:00:00Z')).toBe('15 Apr 2024');
      expect(formatDate('2024-05-15T00:00:00Z')).toBe('15 May 2024');
      expect(formatDate('2024-06-15T00:00:00Z')).toBe('15 Jun 2024');
      expect(formatDate('2024-08-15T00:00:00Z')).toBe('15 Aug 2024');
      expect(formatDate('2024-10-15T00:00:00Z')).toBe('15 Oct 2024');
      expect(formatDate('2024-11-15T00:00:00Z')).toBe('15 Nov 2024');
    });
  });
});
