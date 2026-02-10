import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient } from '@tanstack/react-query';
import { useMerchantData, MERCHANT_DATA_QUERY_KEY } from '../use-merchant-data';
import { fetchMerchantData } from '../../api/merchant';
import { TestWrapper } from '@/shared/test-utils/test-wrapper';
import type { MerchantDataResponse } from '@/shared/types/api';

// Mock the API
jest.mock('../../api/merchant');

const mockFetchMerchantData = fetchMerchantData as jest.MockedFunction<
  typeof fetchMerchantData
>;

describe('useMerchantData', () => {
  let queryClient: QueryClient;

  const mockMerchantData: MerchantDataResponse = {
    balance: {
      amount: 1234567,
      currency: 'GBP',
    },
    recent_activity: [
      {
        id: 'act_001',
        type: 'deposit',
        amount: 50000,
        currency: 'GBP',
        date: '2026-02-10T12:00:00.000Z',
        description: 'Payment from Customer ABC',
        status: 'completed',
      },
      {
        id: 'act_002',
        type: 'payout',
        amount: -30000,
        currency: 'GBP',
        date: '2026-02-09T12:00:00.000Z',
        description: 'Payout to Bank Account',
        status: 'completed',
      },
    ],
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  it('should fetch merchant data successfully', async () => {
    mockFetchMerchantData.mockResolvedValueOnce(mockMerchantData);

    const { result } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMerchantData);
    expect(mockFetchMerchantData).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    const errorMessage = 'Failed to fetch merchant data';
    mockFetchMerchantData.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error(errorMessage));
  });

  it('should use correct query key', async () => {
    mockFetchMerchantData.mockResolvedValueOnce(mockMerchantData);

    const { result } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const cachedData = queryClient.getQueryData(MERCHANT_DATA_QUERY_KEY);
    expect(cachedData).toEqual(mockMerchantData);
  });

  it('should cache data correctly', async () => {
    mockFetchMerchantData.mockResolvedValue(mockMerchantData);

    const { result: result1 } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
    });

    // Check that data is cached
    const cachedData = queryClient.getQueryData(MERCHANT_DATA_QUERY_KEY);
    expect(cachedData).toEqual(mockMerchantData);

    // Second hook should use cached data
    const { result: result2 } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    // Data should be available from cache
    expect(result2.current.data).toEqual(mockMerchantData);
  });

  it('should refetch when invalidated', async () => {
    mockFetchMerchantData.mockResolvedValue(mockMerchantData);

    const { result } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockFetchMerchantData).toHaveBeenCalledTimes(1);

    // Invalidate query
    await queryClient.invalidateQueries({ queryKey: MERCHANT_DATA_QUERY_KEY });

    await waitFor(() => {
      expect(mockFetchMerchantData).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle refetch manually', async () => {
    mockFetchMerchantData.mockResolvedValue(mockMerchantData);

    const { result } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockFetchMerchantData).toHaveBeenCalledTimes(1);

    // Manually refetch
    await result.current.refetch();

    expect(mockFetchMerchantData).toHaveBeenCalledTimes(2);
  });

  it('should handle empty recent activity', async () => {
    const emptyActivityData: MerchantDataResponse = {
      balance: {
        amount: 1000000,
        currency: 'GBP',
      },
      recent_activity: [],
    };

    mockFetchMerchantData.mockResolvedValueOnce(emptyActivityData);

    const { result } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.recent_activity).toEqual([]);
  });

  it('should handle different currencies', async () => {
    const eurData: MerchantDataResponse = {
      balance: {
        amount: 500000,
        currency: 'EUR',
      },
      recent_activity: [
        {
          id: 'act_003',
          type: 'deposit',
          amount: 25000,
          currency: 'EUR',
          date: '2026-02-10T12:00:00.000Z',
          description: 'Payment from Customer EUR',
          status: 'completed',
        },
      ],
    };

    mockFetchMerchantData.mockResolvedValueOnce(eurData);

    const { result } = renderHook(() => useMerchantData(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.balance.currency).toBe('EUR');
  });
});
