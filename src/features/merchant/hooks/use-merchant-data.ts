/**
 * React Query hook for merchant data
 */
import { useQuery } from '@tanstack/react-query';
import { fetchMerchantData } from '../api/merchant';
import type { MerchantDataResponse } from '@/shared/types/api';

export const MERCHANT_DATA_QUERY_KEY = ['merchant', 'data'] as const;

export function useMerchantData() {
  return useQuery<MerchantDataResponse>({
    queryKey: MERCHANT_DATA_QUERY_KEY,
    queryFn: fetchMerchantData,
  });
}