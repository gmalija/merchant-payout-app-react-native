/**
 * IBAN Utilities
 * Helper functions for IBAN normalization, formatting, and validation
 *
 * IBAN validation includes:
 * - Country-specific length validation
 * - MOD-97 checksum validation
 * - Format structure validation
 */

/**
 * IBAN length by country code
 * Source: https://www.iban.com/structure
 */
const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22,
  BH: 22, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22,
  DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27,
  GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28,
  IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
  LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22,
  MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28,
  PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24, SE: 24, SI: 19,
  SK: 24, SM: 27, TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20,
};

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

/**
 * Validates IBAN checksum using MOD-97 algorithm
 * @param iban - Normalized IBAN string
 * @returns true if checksum is valid
 *
 * Algorithm:
 * 1. Move first 4 characters to end
 * 2. Replace letters with numbers (A=10, B=11, ..., Z=35)
 * 3. Calculate MOD 97
 * 4. Result must be 1
 *
 * @example
 * validateIbanChecksum('GB82WEST12345698765432') // true
 * validateIbanChecksum('GB00WEST12345698765432') // false (invalid checksum)
 */
export function validateIbanChecksum(iban: string): boolean {
  // Move first 4 chars to end
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      // If it's a letter (A-Z)
      if (code >= 65 && code <= 90) {
        return (code - 55).toString(); // A=10, B=11, etc.
      }
      return char; // Keep digits as is
    })
    .join('');

  // Calculate MOD 97 for large numbers (IBAN can be very long)
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i], 10)) % 97;
  }

  return remainder === 1;
}

/**
 * Validates IBAN length for specific country
 * @param iban - Normalized IBAN string
 * @returns true if length matches country specification
 *
 * @example
 * validateIbanLength('GB82WEST12345698765432') // true (GB = 22 chars)
 * validateIbanLength('GB82WEST1234') // false (too short)
 */
export function validateIbanLength(iban: string): boolean {
  const countryCode = iban.slice(0, 2);
  const expectedLength = IBAN_LENGTHS[countryCode];

  if (!expectedLength) {
    return false; // Unknown country code
  }

  return iban.length === expectedLength;
}

/**
 * Validates IBAN format structure
 * @param iban - Normalized IBAN string
 * @returns true if basic structure is valid
 *
 * Structure: CC##XXXXXXX...
 * - CC: 2 letters (country code)
 * - ##: 2 digits (check digits)
 * - X...: 1-30 alphanumeric characters
 */
export function validateIbanStructure(iban: string): boolean {
  // Must start with 2 letters (country code)
  if (!/^[A-Z]{2}/.test(iban)) {
    return false;
  }

  // Next 2 must be digits (check digits)
  if (!/^[A-Z]{2}[0-9]{2}/.test(iban)) {
    return false;
  }

  // Rest must be alphanumeric
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) {
    return false;
  }

  // Total length must be between 15 and 34
  if (iban.length < 15 || iban.length > 34) {
    return false;
  }

  return true;
}

/**
 * Comprehensive IBAN validation
 * Validates structure, length, and checksum
 *
 * @param iban - IBAN string (will be normalized)
 * @returns Object with validation result and error message if invalid
 *
 * @example
 * validateIban('GB82 WEST 1234 5698 7654 32') // { valid: true }
 * validateIban('GB00 WEST 1234 5698 7654 32') // { valid: false, error: 'Invalid IBAN checksum' }
 * validateIban('XX82 WEST 1234') // { valid: false, error: 'Unknown country code or invalid length' }
 */
export function validateIban(iban: string): { valid: boolean; error?: string } {
  const normalized = normalizeIban(iban);

  // 1. Check basic structure
  if (!validateIbanStructure(normalized)) {
    return {
      valid: false,
      error: 'Invalid IBAN format. Must start with 2 letters and 2 digits',
    };
  }

  // 2. Check country-specific length
  if (!validateIbanLength(normalized)) {
    const countryCode = normalized.slice(0, 2);
    const expectedLength = IBAN_LENGTHS[countryCode];

    if (!expectedLength) {
      return {
        valid: false,
        error: `Unknown country code: ${countryCode}`,
      };
    }

    return {
      valid: false,
      error: `Invalid IBAN length for ${countryCode}. Expected ${expectedLength} characters, got ${normalized.length}`,
    };
  }

  // 3. Check MOD-97 checksum (most important)
  if (!validateIbanChecksum(normalized)) {
    return {
      valid: false,
      error: 'Invalid IBAN checksum',
    };
  }

  return { valid: true };
}
