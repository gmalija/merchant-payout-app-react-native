/**
 * IBAN Utilities
 * Helper functions for IBAN normalization and formatting
 */

/**
 * Normalizes an IBAN by converting to uppercase and removing spaces
 * @param value - The IBAN string to normalize
 * @returns Normalized IBAN string (uppercase, no spaces)
 *
 * @example
 * normalizeIban('gb82 west 1234') // 'GB82WEST1234'
 * normalizeIban('fr14 2004 1010') // 'FR1420041010'
 */
export function normalizeIban(value: string): string {
  return value.toUpperCase().replace(/\s/g, '');
}
