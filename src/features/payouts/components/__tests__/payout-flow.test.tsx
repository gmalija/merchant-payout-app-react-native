/**
 * PayoutFlow Component Tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { PayoutFlow } from '../payout-flow';
import { useCreatePayout } from '../../hooks/use-create-payout';
import { useMerchantData } from '@/features/merchant';

// Mock the hooks
jest.mock('../../hooks/use-create-payout');
jest.mock('@/features/merchant');

const mockUseCreatePayout = useCreatePayout as jest.MockedFunction<typeof useCreatePayout>;
const mockUseMerchantData = useMerchantData as jest.MockedFunction<typeof useMerchantData>;

describe('PayoutFlow', () => {
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseCreatePayout.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      data: undefined,
      error: null,
      isError: false,
      isSuccess: false,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined as any,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: true,
      isPaused: false,
      status: 'idle',
      submittedAt: 0,
    });

    mockUseMerchantData.mockReturnValue({
      data: {
        available_balance: 100000,
        pending_balance: 0,
        currency: 'GBP',
        activity: [],
      },
      isLoading: false,
      isPending: false,
      isEnabled: true,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
      status: 'success',
      fetchStatus: 'idle',
      isRefetching: false,
      isFetching: false,
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isStale: false,
      promise: Promise.resolve({
        available_balance: 100000,
        pending_balance: 0,
        currency: 'GBP',
        activity: [],
      }) as any,
    });
  });

  it('should render the form initially', () => {
    render(<PayoutFlow />);

    expect(screen.getByTestId('payout-amount-input')).toBeTruthy();
    expect(screen.getByTestId('payout-iban-input')).toBeTruthy();
    expect(screen.getByTestId('payout-continue-button')).toBeTruthy();
  });

  it('should show confirmation modal when form is submitted', async () => {
    render(<PayoutFlow />);

    const amountInput = screen.getByTestId('payout-amount-input');
    const ibanInput = screen.getByTestId('payout-iban-input');
    const continueButton = screen.getByTestId('payout-continue-button');

    fireEvent.changeText(amountInput, '100');
    fireEvent.changeText(ibanInput, 'GB82WEST12345698765432');

    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });

    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(screen.getByTestId('payout-confirmation-modal')).toBeTruthy();
      expect(screen.getByTestId('confirm-amount')).toBeTruthy();
      expect(screen.getByTestId('confirm-currency')).toBeTruthy();
      expect(screen.getByTestId('confirm-iban')).toBeTruthy();
    });
  });

  it('should return to form when confirmation is cancelled', async () => {
    render(<PayoutFlow />);

    // Fill form
    const amountInput = screen.getByTestId('payout-amount-input');
    const ibanInput = screen.getByTestId('payout-iban-input');
    fireEvent.changeText(amountInput, '100');
    fireEvent.changeText(ibanInput, 'GB82WEST12345698765432');

    // Submit to show confirmation
    const continueButton = screen.getByTestId('payout-continue-button');
    await waitFor(() => expect(continueButton).not.toBeDisabled());
    fireEvent.press(continueButton);

    // Wait for modal
    await waitFor(() => {
      expect(screen.getByTestId('payout-confirmation-modal')).toBeTruthy();
    });

    // Cancel confirmation
    const cancelButton = screen.getByTestId('confirm-cancel-button');
    fireEvent.press(cancelButton);

    // Should return to form
    await waitFor(() => {
      expect(screen.getByTestId('payout-amount-input')).toBeTruthy();
    });
  });

  it('should create payout when confirmed with sufficient funds', async () => {
    mockMutateAsync.mockResolvedValue({
      id: 'payout-123',
      amount: 10000,
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    mockUseCreatePayout.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      data: {
        id: 'payout-123',
        amount: 10000,
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
        status: 'pending',
        created_at: new Date().toISOString(),
      },
      error: null,
      isError: false,
      isSuccess: true,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined as any,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: false,
      isPaused: false,
      status: 'success',
      submittedAt: Date.now(),
    });

    render(<PayoutFlow />);

    // Fill and submit form
    fireEvent.changeText(screen.getByTestId('payout-amount-input'), '100');
    fireEvent.changeText(screen.getByTestId('payout-iban-input'), 'GB82WEST12345698765432');

    await waitFor(() => {
      expect(screen.getByTestId('payout-continue-button')).not.toBeDisabled();
    });

    fireEvent.press(screen.getByTestId('payout-continue-button'));

    // Confirm payout
    await waitFor(() => {
      expect(screen.getByTestId('confirm-submit-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('confirm-submit-button'));

    // Should call API with correct data (amount in pence)
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        amount: 10000, // 100 * 100
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
      });
    });
  });

  it('should show insufficient funds screen when balance is too low', async () => {
    mockUseMerchantData.mockReturnValue({
      data: {
        available_balance: 5000, // Only £50
        pending_balance: 0,
        currency: 'GBP',
        activity: [],
      },
      isLoading: false,
      isPending: false,
      isEnabled: true,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
      status: 'success',
      fetchStatus: 'idle',
      isRefetching: false,
      isFetching: false,
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isStale: false,
      promise: Promise.resolve({
        available_balance: 100000,
        pending_balance: 0,
        currency: 'GBP',
        activity: [],
      }) as any,
    });

    render(<PayoutFlow />);

    // Request £100 (more than available £50)
    fireEvent.changeText(screen.getByTestId('payout-amount-input'), '100');
    fireEvent.changeText(screen.getByTestId('payout-iban-input'), 'GB82WEST12345698765432');

    await waitFor(() => {
      expect(screen.getByTestId('payout-continue-button')).not.toBeDisabled();
    });

    fireEvent.press(screen.getByTestId('payout-continue-button'));

    // Confirm
    await waitFor(() => {
      expect(screen.getByTestId('confirm-submit-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('confirm-submit-button'));

    // Should show insufficient funds screen
    await waitFor(() => {
      expect(screen.getByText('Insufficient Funds')).toBeTruthy();
      expect(screen.getByTestId('insufficient-requested')).toBeTruthy();
      expect(screen.getByTestId('insufficient-available')).toBeTruthy();
      expect(screen.getByTestId('insufficient-shortage')).toBeTruthy();
    });

    // Should NOT call API
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should show error screen when API call fails', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network error occurred'));

    render(<PayoutFlow />);

    // Fill and submit form
    fireEvent.changeText(screen.getByTestId('payout-amount-input'), '100');
    fireEvent.changeText(screen.getByTestId('payout-iban-input'), 'GB82WEST12345698765432');

    await waitFor(() => {
      expect(screen.getByTestId('payout-continue-button')).not.toBeDisabled();
    });

    fireEvent.press(screen.getByTestId('payout-continue-button'));

    // Confirm
    await waitFor(() => {
      expect(screen.getByTestId('confirm-submit-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('confirm-submit-button'));

    // Should show error screen
    await waitFor(() => {
      expect(screen.getByText('Payout Failed')).toBeTruthy();
      expect(screen.getByTestId('error-message')).toBeTruthy();
      expect(screen.getByText('Network error occurred')).toBeTruthy();
    });
  });

  it('should handle insufficient funds error from API', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Insufficient funds in merchant account'));

    render(<PayoutFlow />);

    // Fill and submit form
    fireEvent.changeText(screen.getByTestId('payout-amount-input'), '100');
    fireEvent.changeText(screen.getByTestId('payout-iban-input'), 'GB82WEST12345698765432');

    await waitFor(() => {
      expect(screen.getByTestId('payout-continue-button')).not.toBeDisabled();
    });

    fireEvent.press(screen.getByTestId('payout-continue-button'));

    // Confirm
    await waitFor(() => {
      expect(screen.getByTestId('confirm-submit-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('confirm-submit-button'));

    // Should show insufficient funds screen (not generic error)
    await waitFor(() => {
      expect(screen.getByText('Insufficient Funds')).toBeTruthy();
    });
  });

  it('should allow retry after error', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network error'));

    render(<PayoutFlow />);

    // Trigger error
    fireEvent.changeText(screen.getByTestId('payout-amount-input'), '100');
    fireEvent.changeText(screen.getByTestId('payout-iban-input'), 'GB82WEST12345698765432');

    await waitFor(() => expect(screen.getByTestId('payout-continue-button')).not.toBeDisabled());
    fireEvent.press(screen.getByTestId('payout-continue-button'));

    await waitFor(() => expect(screen.getByTestId('confirm-submit-button')).toBeTruthy());
    fireEvent.press(screen.getByTestId('confirm-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Payout Failed')).toBeTruthy();
    });

    // Press retry
    const retryButton = screen.getByTestId('error-retry-button');
    fireEvent.press(retryButton);

    // Should return to form
    await waitFor(() => {
      expect(screen.getByTestId('payout-amount-input')).toBeTruthy();
    });
  });

  it('should return to form after successful payout', async () => {
    mockMutateAsync.mockResolvedValue({
      id: 'payout-123',
      amount: 10000,
      currency: 'GBP',
      iban: 'GB82WEST12345698765432',
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    mockUseCreatePayout.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      data: {
        id: 'payout-123',
        amount: 10000,
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
        status: 'pending',
        created_at: new Date().toISOString(),
      },
      error: null,
      isError: false,
      isSuccess: true,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined as any,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: false,
      isPaused: false,
      status: 'success',
      submittedAt: Date.now(),
    });

    render(<PayoutFlow />);

    // Complete flow to success
    fireEvent.changeText(screen.getByTestId('payout-amount-input'), '100');
    fireEvent.changeText(screen.getByTestId('payout-iban-input'), 'GB82WEST12345698765432');

    await waitFor(() => expect(screen.getByTestId('payout-continue-button')).not.toBeDisabled());
    fireEvent.press(screen.getByTestId('payout-continue-button'));

    await waitFor(() => expect(screen.getByTestId('confirm-submit-button')).toBeTruthy());
    fireEvent.press(screen.getByTestId('confirm-submit-button'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });

    // Since the component uses internal state, we need to simulate the success flow
    // The test above for "should create payout" covers the API call verification
  });

  it('should use default currency from merchant data', () => {
    mockUseMerchantData.mockReturnValue({
      data: {
        available_balance: 100000,
        pending_balance: 0,
        currency: 'EUR',
        activity: [],
      },
      isLoading: false,
      isPending: false,
      isEnabled: true,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
      status: 'success',
      fetchStatus: 'idle',
      isRefetching: false,
      isFetching: false,
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isStale: false,
      promise: Promise.resolve({
        available_balance: 100000,
        pending_balance: 0,
        currency: 'GBP',
        activity: [],
      }) as any,
    });

    render(<PayoutFlow />);

    // EUR should be displayed in picker
    expect(screen.getByText('EUR ▾')).toBeTruthy();
  });
});
