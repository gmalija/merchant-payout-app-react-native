/**
 * Merchant API Client
 */
import { API_BASE_URL } from '@/shared/constants';
import type { MerchantDataResponse } from '@/shared/types/api';

/**
 * Fetch merchant data including balance and recent activity
 */
export async function fetchMerchantData(): Promise<MerchantDataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/merchant`);

  if (!response.ok) {
    throw new Error(`Failed to fetch merchant data: ${response.statusText}`);
  }

  return response.json();
}