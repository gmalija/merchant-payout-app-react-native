/**
 * Payouts API Integration Tests
 * Tests the createPayout API function with MSW handlers
 */
import { createPayout } from '../payouts';
import { server } from '@/mocks/server.node';
import type { CreatePayoutRequest } from '@/shared/types/api';

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
