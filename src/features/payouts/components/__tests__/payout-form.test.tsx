/**
 * PayoutForm Component Tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { PayoutForm } from '../payout-form';

describe('PayoutForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render all form fields', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Amount')).toBeTruthy();
    expect(screen.getByTestId('payout-amount-input')).toBeTruthy();
    expect(screen.getByText('Currency')).toBeTruthy();
    expect(screen.getByTestId('currency-picker')).toBeTruthy();
    expect(screen.getByText('IBAN')).toBeTruthy();
    expect(screen.getByTestId('payout-iban-input')).toBeTruthy();
    expect(screen.getByTestId('payout-continue-button')).toBeTruthy();
  });

  it('should have submit button disabled initially', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByTestId('payout-continue-button');
    expect(submitButton).toBeDisabled();
  });

  it('should select default currency', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} defaultCurrency="EUR" />);

    // Picker should show EUR
    const currencyPicker = screen.getByTestId('currency-picker');
    expect(currencyPicker).toBeTruthy();
    expect(screen.getByText('EUR ▾')).toBeTruthy();
  });

  it('should allow switching currency', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} defaultCurrency="GBP" />);

    const currencyPicker = screen.getByTestId('currency-picker');
    expect(screen.getByText('GBP ▾')).toBeTruthy();

    fireEvent.press(currencyPicker);

    // After press, should toggle to EUR
    expect(screen.getByText('EUR ▾')).toBeTruthy();
  });

  it('should accept valid amount input', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    fireEvent.changeText(amountInput, '100.50');

    expect(amountInput.props.value).toBe('100.50');
  });

  it('should clean non-numeric characters from amount', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    fireEvent.changeText(amountInput, 'abc123.45def');

    expect(amountInput.props.value).toBe('123.45');
  });

  it('should allow only one decimal point in amount', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    fireEvent.changeText(amountInput, '100.50.75');

    expect(amountInput.props.value).toBe('100.5075');
  });

  it('should convert IBAN to uppercase', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const ibanInput = screen.getByTestId('payout-iban-input');
    fireEvent.changeText(ibanInput, 'gb82west12345698765432');

    expect(ibanInput.props.value).toBe('GB82WEST12345698765432');
  });

  it('should remove spaces from IBAN', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const ibanInput = screen.getByTestId('payout-iban-input');
    fireEvent.changeText(ibanInput, 'GB82 WEST 1234 5698 7654 32');

    expect(ibanInput.props.value).toBe('GB82WEST12345698765432');
  });

  it('should show validation errors when fields are touched and invalid', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');

    // Touch and blur without entering value
    fireEvent.changeText(amountInput, '');
    fireEvent(amountInput, 'blur');

    await waitFor(() => {
      expect(screen.getByText('Amount is required')).toBeTruthy();
    });
  });

  it('should show error for invalid amount', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    fireEvent.changeText(amountInput, '0');
    fireEvent(amountInput, 'blur');

    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeTruthy();
    });
  });

  it('should show error for invalid IBAN', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const ibanInput = screen.getByTestId('payout-iban-input');
    // Use an IBAN that passes length check but fails format (no country code)
    fireEvent.changeText(ibanInput, '1234567890123456789');
    fireEvent(ibanInput, 'blur');

    await waitFor(() => {
      expect(screen.getByText(/Invalid IBAN format/)).toBeTruthy();
    });
  });

  it('should enable submit button when form is valid', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    const ibanInput = screen.getByTestId('payout-iban-input');
    const submitButton = screen.getByTestId('payout-continue-button');

    fireEvent.changeText(amountInput, '100.50');
    fireEvent.changeText(ibanInput, 'GB82WEST12345698765432');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call onSubmit with valid data', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    const ibanInput = screen.getByTestId('payout-iban-input');
    const submitButton = screen.getByTestId('payout-continue-button');

    fireEvent.changeText(amountInput, '100.50');
    fireEvent.changeText(ibanInput, 'GB82WEST12345698765432');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: 100.5,
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
      });
    });
  });

  it('should not call onSubmit when form is invalid', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByTestId('payout-continue-button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('should disable all inputs when loading', () => {
    render(<PayoutForm onSubmit={mockOnSubmit} isLoading={true} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    const ibanInput = screen.getByTestId('payout-iban-input');
    const currencyPicker = screen.getByTestId('currency-picker');
    const submitButton = screen.getByTestId('payout-continue-button');

    expect(amountInput.props.editable).toBe(false);
    expect(ibanInput.props.editable).toBe(false);
    expect(currencyPicker).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should normalize IBAN before submission', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    const ibanInput = screen.getByTestId('payout-iban-input');
    const submitButton = screen.getByTestId('payout-continue-button');

    fireEvent.changeText(amountInput, '100');
    fireEvent.changeText(ibanInput, 'gb82 west 1234 5698 7654 32');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: 100,
        currency: 'GBP',
        iban: 'GB82WEST12345698765432',
      });
    });
  });

  it('should show error for amount with too many decimals', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const amountInput = screen.getByTestId('payout-amount-input');
    fireEvent.changeText(amountInput, '100.999');
    fireEvent(amountInput, 'blur');

    await waitFor(() => {
      expect(screen.getByText(/can only have up to 2 decimal places/)).toBeTruthy();
    });
  });

  it('should not call onSubmit when form is empty', async () => {
    render(<PayoutForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByTestId('payout-continue-button');

    // Button should be disabled when form is empty
    expect(submitButton).toBeDisabled();

    // Try to press anyway
    fireEvent.press(submitButton);

    await waitFor(() => {
      // onSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
