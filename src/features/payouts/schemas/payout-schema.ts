/**
 * Payout Validation Schemas using Zod
 */
import { z } from 'zod';
import { normalizeIban } from '@/shared/utils';

/**
 * IBAN validation regex
 * Format: 2 letters (country) + 2 digits (check) + up to 30 alphanumeric characters
 * Examples: FR1420041010050500013M02606, GB82WEST12345698765432
 */
const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;

/**
 * Currency enum schema
 */
export const currencySchema = z.enum(['GBP', 'EUR'], {
  message: 'Please select a valid currency',
});

/**
 * Amount validation schema
 * - Must be a positive number
 * - Must have at most 2 decimal places
 * - Must be greater than 0
 */
export const amountSchema = z
  .number({
    message: 'Amount must be a number',
  })
  .positive('Amount must be greater than 0')
  .multipleOf(0.01, 'Amount can only have up to 2 decimal places')
  .max(1000000, 'Amount cannot exceed £1,000,000');

/**
 * IBAN validation schema
 */
export const ibanSchema = z
  .string({
    message: 'IBAN must be a string',
  })
  .transform(normalizeIban) // Normalize first: uppercase and remove spaces
  .pipe(
    z
      .string()
      .min(15, 'IBAN must be at least 15 characters')
      .max(34, 'IBAN must be at most 34 characters')
      .regex(IBAN_REGEX, 'Invalid IBAN format. Must start with 2 letters followed by 2 digits')
  );

/**
 * Complete payout form schema
 */
export const payoutFormSchema = z.object({
  amount: amountSchema,
  currency: currencySchema,
  iban: ibanSchema,
});

/**
 * Type inference from schema
 */
export type PayoutFormData = z.infer<typeof payoutFormSchema>;

/**
 * String amount input schema (for form inputs before parsing)
 */
export const amountInputSchema = z
  .string()
  .min(1, 'Amount is required')
  .refine((val) => !isNaN(Number(val)), 'Amount must be a valid number')
  .refine((val) => Number(val) > 0, 'Amount must be greater than 0')
  .refine(
    (val) => {
      const num = Number(val);
      return num === Math.round(num * 100) / 100;
    },
    'Amount can only have up to 2 decimal places'
  )
  .transform((val) => Number(val));

/**
 * Complete form schema with string inputs (for React Native TextInput)
 */
export const payoutFormInputSchema = z.object({
  amount: amountInputSchema,
  currency: currencySchema,
  iban: ibanSchema,
});

/**
 * Helper to validate individual fields
 */
export function validateField<T extends keyof PayoutFormData>(
  field: T,
  value: unknown
): { success: boolean; error?: string } {
  const schema = payoutFormSchema.shape[field];
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true };
  }

  const firstError = result.error?.issues?.[0];
  return {
    success: false,
    error: firstError?.message || 'Validation failed',
  };
}

/**
 * Helper to validate the entire form
 */
export function validatePayoutForm(data: unknown): {
  success: boolean;
  data?: PayoutFormData;
  errors?: Partial<Record<keyof PayoutFormData, string>>;
} {
  const result = payoutFormSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Partial<Record<keyof PayoutFormData, string>> = {};
  result.error?.issues?.forEach((err) => {
    const field = err.path[0] as keyof PayoutFormData;
    if (field && !errors[field]) {
      errors[field] = err.message;
    }
  });

  return { success: false, errors };
}