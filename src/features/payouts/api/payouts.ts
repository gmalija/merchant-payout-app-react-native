import { API_BASE_URL } from '@/shared/constants';
import type { CreatePayoutRequest, PayoutResponse } from '@/shared/types/api';
import { getDeviceId } from '@/shared/utils/device';

export async function createPayout(
  request: CreatePayoutRequest
): Promise<PayoutResponse> {

  const deviceId = getDeviceId();

  const payloadWithDeviceId: CreatePayoutRequest = {
    ...request,
    device_id: deviceId,
  };

  const response = await fetch(`${API_BASE_URL}/api/payouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payloadWithDeviceId),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error || `Failed to create payout: ${response.statusText}`
    );
  }

  return response.json();
}

export async function getPayoutById(id: string): Promise<PayoutResponse> {
  const response = await fetch(`${API_BASE_URL}/api/payouts/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error || `Failed to fetch payout: ${response.statusText}`
    );
  }

  return response.json();
}