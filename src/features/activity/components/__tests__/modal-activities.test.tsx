import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { useActivityInfinite } from '@/features/activity';
import { TestWrapper } from '@/shared/test-utils/test-wrapper';
import type { ActivityItem } from '@/shared/types/api';
import ModalScreen from '../modal-activities';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock React Query hook
jest.mock('@/features/activity', () => ({
  ...jest.requireActual('@/features/activity'),
  useActivityInfinite: jest.fn(),
}));

const mockUseActivityInfinite = useActivityInfinite as jest.MockedFunction<
  typeof useActivityInfinite
>;

describe('ModalScreen', () => {
  const mockRouter = {
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const mockActivity: ActivityItem[] = [
    {
      id: 'act_001',
      type: 'deposit',
      amount: 150000,
      currency: 'GBP',
      date: '2024-01-15T10:30:00Z',
      description: 'Payment from Customer ABC',
      status: 'completed',
    },
    {
      id: 'act_002',
      type: 'payout',
      amount: -50000,
      currency: 'GBP',
      date: '2024-01-14T10:30:00Z',
      description: 'Payout to Bank Account ****1234',
      status: 'completed',
    },
  ];

  it('shows loading state initially', () => {
    mockUseActivityInfinite.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      refetch: jest.fn(),
    } as any);

    render(
      <TestWrapper>
        <ModalScreen />
      </TestWrapper>
    );

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    expect(screen.getByText('Loading activity...')).toBeTruthy();
  });

  it('displays activity items after successful fetch', async () => {
    mockUseActivityInfinite.mockReturnValue({
      data: {
        pages: [
          {
            items: mockActivity,
            next_cursor: null,
            has_more: false,
          },
        ],
        pageParams: [null],
      },
      isLoading: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      refetch: jest.fn(),
    } as any);

    render(
      <TestWrapper>
        <ModalScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('modal-activities')).toBeTruthy();
    });

    expect(screen.getByTestId('activity-detail-item-act_001')).toBeTruthy();
    expect(screen.getByTestId('activity-detail-item-act_002')).toBeTruthy();
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByText('Payout to Bank Account ****1234')).toBeTruthy();
  });

  it('closes modal when close button is pressed', async () => {
    mockUseActivityInfinite.mockReturnValue({
      data: {
        pages: [
          {
            items: mockActivity,
            next_cursor: null,
            has_more: false,
          },
        ],
        pageParams: [null],
      },
      isLoading: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      refetch: jest.fn(),
    } as any);

    render(
      <TestWrapper>
        <ModalScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('close-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('close-button'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('displays error message on fetch failure', async () => {
    const mockError = new Error('Network error');
    mockUseActivityInfinite.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      refetch: jest.fn(),
    } as any);

    render(
      <TestWrapper>
        <ModalScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeTruthy();
    });

    expect(screen.getByText('Network error')).toBeTruthy();
  });

  it('shows loading more indicator when fetching additional pages', async () => {
    mockUseActivityInfinite.mockReturnValue({
      data: {
        pages: [
          {
            items: mockActivity,
            next_cursor: 'act_002',
            has_more: true,
          },
        ],
        pageParams: [null],
      },
      isLoading: false,
      error: null,
      hasNextPage: true,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: true,
      refetch: jest.fn(),
    } as any);

    render(
      <TestWrapper>
        <ModalScreen />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-more-indicator')).toBeTruthy();
    });
  });

  it('does not show loading more indicator on initial load', () => {
    mockUseActivityInfinite.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      refetch: jest.fn(),
    } as any);

    render(
      <TestWrapper>
        <ModalScreen />
      </TestWrapper>
    );

    // Should show main loading indicator but not the "loading more" footer
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    expect(screen.queryByTestId('loading-more-indicator')).toBeNull();
  });
});
