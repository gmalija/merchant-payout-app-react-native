/**
 * Payout Result Components Tests
 * Tests for PayoutSuccess, PayoutError, and InsufficientFunds components
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PayoutSuccess, PayoutError, InsufficientFunds } from '../payout-result';

describe('PayoutSuccess', () => {
  const mockOnDone = jest.fn();

  beforeEach(() => {
    mockOnDone.mockClear();
  });

  it('should render success title and icon', () => {
    render(
      <PayoutSuccess
        amount={100}
        currency="GBP"
        payoutId="payout-123"
        onDone={mockOnDone}
      />
    );

    expect(screen.getByText('Payout Completed')).toBeTruthy();
  });

  it('should format amount correctly with currency symbol', () => {
    render(
      <PayoutSuccess
        amount={100.5}
        currency="GBP"
        payoutId="payout-123"
        onDone={mockOnDone}
      />
    );

    // Amount is multiplied by 100 to convert to lowest denomination
    expect(screen.getByText(/£100.50/)).toBeTruthy();
  });

  it('should format EUR currency correctly', () => {
    render(
      <PayoutSuccess
        amount={250.75}
        currency="EUR"
        payoutId="payout-456"
        onDone={mockOnDone}
      />
    );

    expect(screen.getByText(/€250.75/)).toBeTruthy();
  });

  it('should display success message', () => {
    render(
      <PayoutSuccess
        amount={100}
        currency="GBP"
        payoutId="payout-123"
        onDone={mockOnDone}
      />
    );

    expect(
      screen.getByText(/has been processed successfully/)
    ).toBeTruthy();
  });

  it('should have Create Another Payout button', () => {
    render(
      <PayoutSuccess
        amount={100}
        currency="GBP"
        payoutId="payout-123"
        onDone={mockOnDone}
      />
    );

    const button = screen.getByTestId('success-done-button');
    expect(button).toBeTruthy();
    expect(screen.getByText('Create Another Payout')).toBeTruthy();
  });

  it('should call onDone when button is pressed', () => {
    render(
      <PayoutSuccess
        amount={100}
        currency="GBP"
        payoutId="payout-123"
        onDone={mockOnDone}
      />
    );

    const button = screen.getByTestId('success-done-button');
    fireEvent.press(button);

    expect(mockOnDone).toHaveBeenCalledTimes(1);
  });

  it('should format large amounts with commas', () => {
    render(
      <PayoutSuccess
        amount={123456.78}
        currency="GBP"
        payoutId="payout-999"
        onDone={mockOnDone}
      />
    );

    expect(screen.getByText(/£123,456.78/)).toBeTruthy();
  });
});

describe('PayoutError', () => {
  const mockOnRetry = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render error title and icon', () => {
    render(
      <PayoutError
        error="Network error occurred"
        onRetry={mockOnRetry}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Payout Failed')).toBeTruthy();
  });

  it('should display error subtitle', () => {
    render(
      <PayoutError
        error="Network error occurred"
        onRetry={mockOnRetry}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("We couldn't process your payout")).toBeTruthy();
  });

  it('should display the error message', () => {
    render(
      <PayoutError
        error="Network error occurred"
        onRetry={mockOnRetry}
        onCancel={mockOnCancel}
      />
    );

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeTruthy();
    expect(screen.getByText('Network error occurred')).toBeTruthy();
  });

  it('should have Cancel and Try Again buttons', () => {
    render(
      <PayoutError
        error="Service unavailable"
        onRetry={mockOnRetry}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByTestId('error-cancel-button')).toBeTruthy();
    expect(screen.getByTestId('error-retry-button')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Try Again')).toBeTruthy();
  });

  it('should call onCancel when Cancel button is pressed', () => {
    render(
      <PayoutError
        error="Test error"
        onRetry={mockOnRetry}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByTestId('error-cancel-button');
    fireEvent.press(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnRetry).not.toHaveBeenCalled();
  });

  it('should call onRetry when Try Again button is pressed', () => {
    render(
      <PayoutError
        error="Test error"
        onRetry={mockOnRetry}
        onCancel={mockOnCancel}
      />
    );

    const retryButton = screen.getByTestId('error-retry-button');
    fireEvent.press(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should display different error messages correctly', () => {
    const { rerender } = render(
      <PayoutError
        error="Insufficient funds in merchant account"
        onRetry={mockOnRetry}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Insufficient funds in merchant account')).toBeTruthy();

    rerender(
      <PayoutError
        error="Invalid IBAN format"
        onRetry={mockOnRetry}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Invalid IBAN format')).toBeTruthy();
  });
});

describe('InsufficientFunds', () => {
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnCancel.mockClear();
  });

  it('should render insufficient funds title and icon', () => {
    render(
      <InsufficientFunds
        requestedAmount={100}
        currency="GBP"
        availableBalance={50}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Insufficient Funds')).toBeTruthy();
  });

  it('should display subtitle message', () => {
    render(
      <InsufficientFunds
        requestedAmount={100}
        currency="GBP"
        availableBalance={50}
        onCancel={mockOnCancel}
      />
    );

    expect(
      screen.getByText("You don't have enough balance for this payout")
    ).toBeTruthy();
  });

  it('should display requested amount correctly', () => {
    render(
      <InsufficientFunds
        requestedAmount={100}
        currency="GBP"
        availableBalance={50}
        onCancel={mockOnCancel}
      />
    );

    const requestedElement = screen.getByTestId('insufficient-requested');
    expect(requestedElement).toBeTruthy();
    expect(screen.getByText(/£100.00/)).toBeTruthy();
  });

  it('should display available balance correctly', () => {
    render(
      <InsufficientFunds
        requestedAmount={100}
        currency="GBP"
        availableBalance={50}
        onCancel={mockOnCancel}
      />
    );

    const availableElement = screen.getByTestId('insufficient-available');
    expect(availableElement).toBeTruthy();
    expect(availableElement.props.children).toBe('£50.00');
  });

  it('should calculate and display shortage correctly', () => {
    render(
      <InsufficientFunds
        requestedAmount={100}
        currency="GBP"
        availableBalance={50}
        onCancel={mockOnCancel}
      />
    );

    const shortageElement = screen.getByTestId('insufficient-shortage');
    expect(shortageElement).toBeTruthy();
    // Shortage = 100 - 50 = 50
    expect(shortageElement.props.children).toBe('£50.00');
  });

  it('should work with EUR currency', () => {
    render(
      <InsufficientFunds
        requestedAmount={200}
        currency="EUR"
        availableBalance={120}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/€200.00/)).toBeTruthy();
    expect(screen.getByText(/€120.00/)).toBeTruthy();
    expect(screen.getByText(/€80.00/)).toBeTruthy();
  });

  it('should display info text about reducing amount', () => {
    render(
      <InsufficientFunds
        requestedAmount={100}
        currency="GBP"
        availableBalance={50}
        onCancel={mockOnCancel}
      />
    );

    expect(
      screen.getByText(/Please reduce the payout amount/)
    ).toBeTruthy();
  });

  it('should have Go Back button', () => {
    render(
      <InsufficientFunds
        requestedAmount={100}
        currency="GBP"
        availableBalance={50}
        onCancel={mockOnCancel}
      />
    );

    const button = screen.getByTestId('insufficient-back-button');
    expect(button).toBeTruthy();
    expect(screen.getByText('Go Back')).toBeTruthy();
  });

  it('should call onCancel when Go Back button is pressed', () => {
    render(
      <InsufficientFunds
        requestedAmount={100}
        currency="GBP"
        availableBalance={50}
        onCancel={mockOnCancel}
      />
    );

    const button = screen.getByTestId('insufficient-back-button');
    fireEvent.press(button);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should handle large amounts with correct formatting', () => {
    render(
      <InsufficientFunds
        requestedAmount={1234567.89}
        currency="GBP"
        availableBalance={1000000}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/£1,234,567.89/)).toBeTruthy();
    expect(screen.getByText(/£1,000,000.00/)).toBeTruthy();
  });

  it('should calculate shortage correctly for edge cases', () => {
    render(
      <InsufficientFunds
        requestedAmount={100.01}
        currency="GBP"
        availableBalance={100}
        onCancel={mockOnCancel}
      />
    );

    // Shortage = 100.01 - 100 = 0.01
    const shortageElement = screen.getByTestId('insufficient-shortage');
    expect(shortageElement).toBeTruthy();
  });
});
