import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient } from '@tanstack/react-query';
import { useActivityInfinite, ACTIVITY_QUERY_KEY } from '../use-activity-infinite';
import { fetchActivity } from '../../api/activity';
import { TestWrapper } from '@/shared/test-utils/test-wrapper';
import type { PaginatedActivityResponse, ActivityItem } from '@/shared/types/api';

// Mock the API
jest.mock('../../api/activity');

const mockFetchActivity = fetchActivity as jest.MockedFunction<typeof fetchActivity>;

describe('useActivityInfinite', () => {
  let queryClient: QueryClient;

  const mockActivityItem: ActivityItem = {
    id: 'act_001',
    type: 'deposit',
    amount: 50000,
    currency: 'GBP',
    date: '2026-02-10T12:00:00.000Z',
    description: 'Payment from Customer ABC',
    status: 'completed',
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  it('should fetch initial page of activities', async () => {
    const mockResponse: PaginatedActivityResponse = {
      items: [mockActivityItem],
      next_cursor: 'cursor_002',
      has_more: true,
    };

    mockFetchActivity.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useActivityInfinite(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
    expect(mockFetchActivity).toHaveBeenCalledWith(null, 15);
  });

  it('should fetch next page with cursor', async () => {
    const page1: PaginatedActivityResponse = {
      items: [mockActivityItem],
      next_cursor: 'cursor_002',
      has_more: true,
    };

    const page2: PaginatedActivityResponse = {
      items: [
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
      next_cursor: null,
      has_more: false,
    };

    mockFetchActivity
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useActivityInfinite(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    // Wait for first page
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(true);

    // Fetch next page
    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    expect(result.current.data?.pages[0]).toEqual(page1);
    expect(result.current.data?.pages[1]).toEqual(page2);
    expect(result.current.hasNextPage).toBe(false);
    expect(mockFetchActivity).toHaveBeenCalledWith('cursor_002', 15);
  });

  it('should handle has_more correctly when no more pages', async () => {
    const mockResponse: PaginatedActivityResponse = {
      items: [mockActivityItem],
      next_cursor: null,
      has_more: false,
    };

    mockFetchActivity.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useActivityInfinite(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it('should handle errors', async () => {
    const errorMessage = 'Failed to fetch activities';
    mockFetchActivity.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useActivityInfinite(), {
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
    const mockResponse: PaginatedActivityResponse = {
      items: [mockActivityItem],
      next_cursor: null,
      has_more: false,
    };

    mockFetchActivity.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useActivityInfinite(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const cachedData = queryClient.getQueryData(ACTIVITY_QUERY_KEY);
    expect(cachedData).toBeDefined();
  });

  it('should refetch when invalidated', async () => {
    const mockResponse: PaginatedActivityResponse = {
      items: [mockActivityItem],
      next_cursor: null,
      has_more: false,
    };

    mockFetchActivity.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useActivityInfinite(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockFetchActivity).toHaveBeenCalledTimes(1);

    // Invalidate query
    await queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEY });

    await waitFor(() => {
      expect(mockFetchActivity).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle multiple pages correctly', async () => {
    const pages: PaginatedActivityResponse[] = [
      {
        items: [{ ...mockActivityItem, id: 'act_001' }],
        next_cursor: 'cursor_002',
        has_more: true,
      },
      {
        items: [{ ...mockActivityItem, id: 'act_002' }],
        next_cursor: 'cursor_003',
        has_more: true,
      },
      {
        items: [{ ...mockActivityItem, id: 'act_003' }],
        next_cursor: null,
        has_more: false,
      },
    ];

    mockFetchActivity
      .mockResolvedValueOnce(pages[0])
      .mockResolvedValueOnce(pages[1])
      .mockResolvedValueOnce(pages[2]);

    const { result } = renderHook(() => useActivityInfinite(), {
      wrapper: ({ children }) => (
        <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
      ),
    });

    // First page
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Second page
    result.current.fetchNextPage();
    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    // Third page
    result.current.fetchNextPage();
    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(3);
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.data?.pages).toEqual(pages);
  });
});
