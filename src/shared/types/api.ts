/**
 * API Type Definitions
 */

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type Currency = 'GBP' | 'EUR';

export type ActivityType = 'payout' | 'deposit' | 'refund' | 'fee';

export type ActivityStatus = 'completed' | 'pending' | 'processing' | 'failed';

export interface BalanceResponse {
  available_balance: number; // in lowest denomination of the currency
  pending_balance: number; // in lowest denomination of the currency
  currency: Currency;
}

export interface MerchantDataResponse {
  available_balance: number; // in lowest denomination of the currency
  pending_balance: number; // in lowest denomination of the currency
  currency: Currency;
  activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  amount: number; // in lowest denomination of the currency
  currency: Currency;
  date: string;
  description: string;
  status: ActivityStatus;
}

export interface PaginatedActivityResponse {
  items: ActivityItem[];
  next_cursor: string | null; // null when no more items
  has_more: boolean;
}

export type ActivityResponse = ActivityItem[];

export interface CreatePayoutRequest {
  amount: number; // in lowest denomination of the currency
  currency: Currency;
  iban: string;
  device_id?: string;
}

export interface PayoutResponse {
  id: string;
  status: PayoutStatus;
  amount: number; // in lowest denomination of the currency
  currency: Currency;
  iban: string;
  created_at: string;
}
