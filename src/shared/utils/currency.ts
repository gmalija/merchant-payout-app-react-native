/**
 * Currency Formatting Utilities
 */
import type { Currency } from '@/shared/types/api';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: '£',
  EUR: '€',
};

/**
 * Convert amount from lowest denomination (e.g., pence) to major unit (e.g., pounds)
 * @param amount - Amount in lowest denomination
 * @returns Amount in major unit
 */
export function fromLowestDenomination(amount: number): number {
  return amount / 100;
}

/**
 * Convert amount from major unit (e.g., pounds) to lowest denomination (e.g., pence)
 * @param amount - Amount in major unit
 * @returns Amount in lowest denomination
 */
export function toLowestDenomination(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Get currency symbol for a given currency code
 * @param currency - Currency code
 * @returns Currency symbol (e.g., "£", "€")
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency] || currency;
}

/**
 * Format currency amount with symbol
 * @param amount - Amount in lowest denomination (e.g., pence) or major unit (e.g., pounds)
 * @param currency - Currency code
 * @param isLowestDenomination - Whether amount is in lowest denomination (default: true)
 * @returns Formatted string (e.g., "£1,234.56")
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  isLowestDenomination: boolean = true
): string {
  const symbol = getCurrencySymbol(currency);
  const majorAmount = isLowestDenomination ? fromLowestDenomination(amount) : amount;

  // Format with commas and 2 decimal places
  const formatted = Math.abs(majorAmount).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Handle negative amounts
  const sign = majorAmount < 0 ? '-' : '';

  return `${sign}${symbol}${formatted}`;
}