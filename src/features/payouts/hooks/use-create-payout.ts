import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPayout } from '../api/payouts';
import { MERCHANT_DATA_QUERY_KEY } from '@/features/merchant';
import { ACTIVITY_QUERY_KEY } from '@/features/activity';
import type { CreatePayoutRequest, PayoutResponse } from '@/shared/types/api';

export function useCreatePayout() {
  const queryClient = useQueryClient();

  return useMutation<PayoutResponse, Error, CreatePayoutRequest>({
    mutationFn: createPayout,
    onSuccess: () => {
      // Invalidate merchant data and activity to refresh after payout
      queryClient.invalidateQueries({ queryKey: MERCHANT_DATA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEY });
    },
  });
}