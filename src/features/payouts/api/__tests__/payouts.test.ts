/**
 * Payouts API Integration Tests
 * Tests the createPayout API function with MSW handlers
 */
import { createPayout, getPayoutById } from '../payouts';
import { server } from '@/mocks/server.node';
import type { CreatePayoutRequest } from '@/shared/types/api';
import * as biometric from '@/shared/utils/biometric';
import { BiometricErrorType } from '@/shared/utils/biometric';

jest.mock('@/shared/utils/device', () => ({
  getDeviceId: jest.fn().mockReturnValue('test-device-id'),
}));

jest.mock('@/shared/utils/biometric');

describe('createPayout API - Error Handling', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should return 503 Service Unavailable for amount 99999 (999.99)', async () => {
    const request: CreatePayoutRequest = {
      amount: 99999, // 999.99 in pence - triggers 503
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    await expect(createPayout(request)).rejects.toThrow(
      'Service temporarily unavailable'
    );
  });

  it('should return 400 Insufficient Funds for amount 88888 (888.88)', async () => {
    const request: CreatePayoutRequest = {
      amount: 88888, // 888.88 in pence - triggers 400
      currency: 'EUR',
      iban: 'FR1212345123451234567A123',
    };

    await expect(createPayout(request)).rejects.toThrow('Insufficient funds');
  });

  it('should successfully create payout for normal amounts', async () => {
    const request: CreatePayoutRequest = {
      amount: 50000, // 500.00
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    const result = await createPayout(request);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.amount).toBe(50000);
    expect(result.currency).toBe('GBP');
    expect(result.iban).toBe('GB82WEST12345698765432');
    expect(['pending', 'completed', 'failed']).toContain(result.status);
  });

  it('should handle EUR currency correctly', async () => {
    const request: CreatePayoutRequest = {
      amount: 10000,
      currency: 'EUR',
      iban: 'FR1212345123451234567A123',
    };

    const result = await createPayout(request);

    expect(result).toBeDefined();
    expect(result.currency).toBe('EUR');
  });

  it('should handle amounts ending in 99 pence as failed status', async () => {
    // According to mocks/data.ts line 93, amounts ending in 99 return failed status
    const request: CreatePayoutRequest = {
      amount: 10099, // 100.99 - should return failed status
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    const result = await createPayout(request);

    expect(result).toBeDefined();
    expect(result.status).toBe('failed');
  });

  it('should handle amounts not ending in 99 as completed status', async () => {
    const request: CreatePayoutRequest = {
      amount: 10000, // 100.00 - should return completed status
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    const result = await createPayout(request);

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
  });
});

describe('createPayout API - Biometric Authentication', () => {
  const mockAuthenticateWithBiometrics = biometric.authenticateWithBiometrics as jest.MockedFunction<
    typeof biometric.authenticateWithBiometrics
  >;

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('should require biometric authentication for amounts >= £1,000', async () => {
    mockAuthenticateWithBiometrics.mockResolvedValueOnce({ success: true });

    const request: CreatePayoutRequest = {
      amount: 100000, // £1,000.00 - requires biometrics
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    const result = await createPayout(request);

    expect(mockAuthenticateWithBiometrics).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it('should not require biometric authentication for amounts < £1,000', async () => {
    const request: CreatePayoutRequest = {
      amount: 99900, // £999.00 - does NOT require biometrics
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    const result = await createPayout(request);

    expect(mockAuthenticateWithBiometrics).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw error when biometrics not enrolled', async () => {
    mockAuthenticateWithBiometrics.mockResolvedValueOnce({
      success: false,
      error: {
        type: BiometricErrorType.NOT_ENROLLED,
        message: 'Not enrolled',
      },
    });

    const request: CreatePayoutRequest = {
      amount: 150000, // £1,500.00
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    await expect(createPayout(request)).rejects.toThrow(
      'Biometric authentication is required for payouts over £1,000.00. Please enable Face ID, Touch ID, or Fingerprint authentication in your device Settings.'
    );
  });

  it('should throw error when biometrics not available', async () => {
    mockAuthenticateWithBiometrics.mockResolvedValueOnce({
      success: false,
      error: {
        type: BiometricErrorType.NOT_AVAILABLE,
        message: 'Not available',
      },
    });

    const request: CreatePayoutRequest = {
      amount: 200000, // £2,000.00
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    await expect(createPayout(request)).rejects.toThrow(
      'Biometric authentication is required for payouts over £1,000.00, but is not available on this device.'
    );
  });

  it('should throw error when biometric authentication fails', async () => {
    mockAuthenticateWithBiometrics.mockResolvedValueOnce({
      success: false,
      error: {
        type: BiometricErrorType.AUTH_FAILED,
        message: 'Authentication failed',
      },
    });

    const request: CreatePayoutRequest = {
      amount: 125000, // £1,250.00
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    await expect(createPayout(request)).rejects.toThrow('Authentication failed');
  });

  it('should throw error when biometric authentication is cancelled', async () => {
    mockAuthenticateWithBiometrics.mockResolvedValueOnce({
      success: false,
      error: {
        type: BiometricErrorType.CANCELLED,
        message: 'User cancelled',
      },
    });

    const request: CreatePayoutRequest = {
      amount: 175000, // £1,750.00
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    await expect(createPayout(request)).rejects.toThrow('User cancelled');
  });

  it('should use default error message when biometric error has no message', async () => {
    mockAuthenticateWithBiometrics.mockResolvedValueOnce({
      success: false,
      error: {
        type: BiometricErrorType.UNKNOWN,
        message: undefined,
      },
    });

    const request: CreatePayoutRequest = {
      amount: 110000, // £1,100.00
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    await expect(createPayout(request)).rejects.toThrow('Biometric authentication failed');
  });
});

describe('getPayoutById API', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should fetch payout by ID successfully', async () => {
    // First create a payout to get a valid ID
    const createRequest: CreatePayoutRequest = {
      amount: 50000,
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    const created = await createPayout(createRequest);
    const result = await getPayoutById(created.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(created.id);
    expect(result.amount).toBeDefined();
    expect(result.currency).toBeDefined();
    expect(result.status).toBeDefined();
  });

  it('should handle errors when fetching payout fails', async () => {
    // Test with ID that doesn't exist in MSW mock
    await expect(getPayoutById('payout_nonexistent')).rejects.toThrow();
  });
});