/**
 * Payout Feature Types
 */
import type { Currency } from '@/shared/types/api';

export interface PayoutFormData {
  amount: string;
  currency: Currency;
  iban: string;
}

export interface PayoutFormErrors {
  amount?: string;
  iban?: string;
}

export type PayoutFlowState =
  | 'form'
  | 'confirming'
  | 'submitting'
  | 'success'
  | 'error'
  | 'insufficient_funds';
