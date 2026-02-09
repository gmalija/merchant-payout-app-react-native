import { API_BASE_URL } from '@/shared/constants';
import type { CreatePayoutRequest, PayoutResponse } from '@/shared/types/api';
import { getDeviceId } from '@/shared/utils/device';
import {
  authenticateWithBiometrics,
  BiometricErrorType,
} from '@/shared/utils/biometric';

/**
 * Threshold amount for requiring biometric authentication
 * 100000 = £1,000.00 or €1,000.00 (in lowest denomination)
 */
const BIOMETRIC_THRESHOLD = 100000;

/**
 * Create a new payout
 * Automatically includes device ID in the request
 * Requires biometric authentication for amounts >= £1,000.00 (or equivalent)
 */
export async function createPayout(
  request: CreatePayoutRequest
): Promise<PayoutResponse> {

  // Check if biometric authentication is required
  if (request.amount >= BIOMETRIC_THRESHOLD) {
    const authResult = await authenticateWithBiometrics();

    if (!authResult.success) {
      // If biometrics not enrolled, throw specific error
      if (authResult.error?.type === BiometricErrorType.NOT_ENROLLED) {
        throw new Error(
          'Biometric authentication is required for payouts over £1,000.00. Please enable Face ID, Touch ID, or Fingerprint authentication in your device Settings.'
        );
      }

      // If biometrics not available
      if (authResult.error?.type === BiometricErrorType.NOT_AVAILABLE) {
        throw new Error(
          'Biometric authentication is required for payouts over £1,000.00, but is not available on this device.'
        );
      }

      // If authentication failed or was cancelled
      throw new Error(
        authResult.error?.message || 'Biometric authentication failed'
      );
    }
  }

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