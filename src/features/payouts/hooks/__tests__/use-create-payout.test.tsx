import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient } from '@tanstack/react-query';
import { useCreatePayout } from '../use-create-payout';
import { createPayout } from '../../api/payouts';
import { TestWrapper } from '@/shared/test-utils/test-wrapper';
import { MERCHANT_DATA_QUERY_KEY } from '@/features/merchant';
import { ACTIVITY_QUERY_KEY } from '@/features/activity';
import type { CreatePayoutRequest, PayoutResponse } from '@/shared/types/api';

// Mock the API
jest.mock('../../api/payouts');

const mockCreatePayout = createPayout as jest.MockedFunction<typeof createPayout>;

describe('useCreatePayout', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  it('should successfully create a payout', async () => {
    const mockResponse: PayoutResponse = {
      id: 'payout_123',
      status: 'completed',
      amount: 50000,
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
      created_at: '2026-02-10T12:00:00.000Z',
    };

    mockCreatePayout.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    const request: CreatePayoutRequest = {
      amount: 50000,
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    result.current.mutate(request);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockCreatePayout).toHaveBeenCalledWith(request, expect.any(Object));
    expect(mockCreatePayout).toHaveBeenCalledTimes(1);
  });

  it('should handle payout creation errors', async () => {
    const errorMessage = 'Insufficient funds';
    mockCreatePayout.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    const request: CreatePayoutRequest = {
      amount: 88888,
      currency: 'EUR',
      iban: 'FR1212345123451234567A123',
    };

    result.current.mutate(request);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error(errorMessage));
  });

  it('should invalidate queries on success', async () => {
    const mockResponse: PayoutResponse = {
      id: 'payout_456',
      status: 'completed',
      amount: 10000,
      currency: 'EUR',
      iban: 'FR1212345123451234567A123',
      created_at: '2026-02-10T12:00:00.000Z',
    };

    mockCreatePayout.mockResolvedValueOnce(mockResponse);

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    const request: CreatePayoutRequest = {
      amount: 10000,
      currency: 'EUR',
      iban: 'FR1212345123451234567A123',
    };

    result.current.mutate(request);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that queries were invalidated
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: MERCHANT_DATA_QUERY_KEY });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ACTIVITY_QUERY_KEY });
    expect(invalidateSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle pending state correctly', async () => {
    let resolvePayout: any;
    mockCreatePayout.mockImplementation(
      () => new Promise((resolve) => { resolvePayout = resolve; })
    );

    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    expect(result.current.isPending).toBe(false);

    const request: CreatePayoutRequest = {
      amount: 50000,
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    result.current.mutate(request);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolvePayout({ id: 'test', status: 'completed', amount: 50000, currency: 'GBP', iban: 'GB82WEST12345698765432', created_at: new Date().toISOString() });
  });

  it('should reset mutation state', async () => {
    const mockResponse: PayoutResponse = {
      id: 'payout_789',
      status: 'completed',
      amount: 25000,
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
      created_at: '2026-02-10T12:00:00.000Z',
    };

    mockCreatePayout.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    const request: CreatePayoutRequest = {
      amount: 25000,
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
    };

    result.current.mutate(request);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Reset the mutation
    result.current.reset();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(false);
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
