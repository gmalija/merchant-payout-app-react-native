/**
 * PayoutConfirmationModal Component Tests
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PayoutConfirmationModal } from '../payout-confirmation-modal';

describe('PayoutConfirmationModal', () => {
  const defaultProps = {
    visible: true,
    amount: 100,
    currency: 'GBP' as const,
    iban: 'GB82WEST12345698765432',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility', () => {
    it('should render when visible is true', () => {
      render(<PayoutConfirmationModal {...defaultProps} visible={true} />);

      expect(screen.getByTestId('payout-confirmation-modal')).toBeTruthy();
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    it('should not render modal content when visible is false', () => {
      render(<PayoutConfirmationModal {...defaultProps} visible={false} />);

      // Modal component still exists but content is not visible
      expect(screen.queryByText('Confirm Payout')).toBeFalsy();
    });
  });

  describe('IBAN Masking', () => {
    it('should mask IBAN showing first 4 and last 4 characters', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          iban="GB82WEST12345698765432"
        />
      );

      const ibanElement = screen.getByTestId('confirm-iban');
      expect(ibanElement.props.children).toBe('GB82**************5432');
    });

    it('should handle short IBANs without masking', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          iban="GB82WEST"
        />
      );

      const ibanElement = screen.getByTestId('confirm-iban');
      expect(ibanElement.props.children).toBe('GB82WEST');
    });

    it('should mask different length IBANs correctly', () => {
      const { rerender } = render(
        <PayoutConfirmationModal
          {...defaultProps}
          iban="FR1212345123451234567A123"
        />
      );

      let ibanElement = screen.getByTestId('confirm-iban');
      expect(ibanElement.props.children).toBe('FR12*****************A123');

      rerender(
        <PayoutConfirmationModal
          {...defaultProps}
          iban="DE89370400440532013000"
        />
      );

      ibanElement = screen.getByTestId('confirm-iban');
      expect(ibanElement.props.children).toBe('DE89**************3000');
    });
  });

  describe('Amount and Currency Display', () => {
    it('should display formatted amount in GBP', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          amount={100}
          currency="GBP"
        />
      );

      const amountElement = screen.getByTestId('confirm-amount');
      // Amount is multiplied by 100 to convert to lowest denomination
      expect(amountElement.props.children).toBe('£100.00');
    });

    it('should display formatted amount in EUR', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          amount={250.5}
          currency="EUR"
        />
      );

      const amountElement = screen.getByTestId('confirm-amount');
      expect(amountElement.props.children).toBe('€250.50');
    });

    it('should display currency code', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          currency="GBP"
        />
      );

      const currencyElement = screen.getByTestId('confirm-currency');
      expect(currencyElement.props.children).toBe('GBP');
    });

    it('should format large amounts with commas', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          amount={123456.78}
          currency="GBP"
        />
      );

      const amountElement = screen.getByTestId('confirm-amount');
      expect(amountElement.props.children).toBe('£123,456.78');
    });
  });

  describe('Buttons and Interactions', () => {
    it('should have Cancel and Confirm buttons', () => {
      render(<PayoutConfirmationModal {...defaultProps} />);

      expect(screen.getByTestId('confirm-cancel-button')).toBeTruthy();
      expect(screen.getByTestId('confirm-submit-button')).toBeTruthy();
      expect(screen.getByText('Cancel')).toBeTruthy();
      expect(screen.getByText('Confirm')).toBeTruthy();
    });

    it('should call onCancel when Cancel button is pressed', () => {
      const onCancel = jest.fn();
      render(<PayoutConfirmationModal {...defaultProps} onCancel={onCancel} />);

      const cancelButton = screen.getByTestId('confirm-cancel-button');
      fireEvent.press(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when Confirm button is pressed', () => {
      const onConfirm = jest.fn();
      render(<PayoutConfirmationModal {...defaultProps} onConfirm={onConfirm} />);

      const confirmButton = screen.getByTestId('confirm-submit-button');
      fireEvent.press(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should not call onConfirm when onCancel is pressed', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );

      const cancelButton = screen.getByTestId('confirm-cancel-button');
      fireEvent.press(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable both buttons when loading', () => {
      render(<PayoutConfirmationModal {...defaultProps} isLoading={true} />);

      const cancelButton = screen.getByTestId('confirm-cancel-button');
      const confirmButton = screen.getByTestId('confirm-submit-button');

      expect(cancelButton).toBeDisabled();
      expect(confirmButton).toBeDisabled();
    });

    it('should enable both buttons when not loading', () => {
      render(<PayoutConfirmationModal {...defaultProps} isLoading={false} />);

      const cancelButton = screen.getByTestId('confirm-cancel-button');
      const confirmButton = screen.getByTestId('confirm-submit-button');

      expect(cancelButton).not.toBeDisabled();
      expect(confirmButton).not.toBeDisabled();
    });

    it('should show loading state on Confirm button', () => {
      render(<PayoutConfirmationModal {...defaultProps} isLoading={true} />);

      const confirmButton = screen.getByTestId('confirm-submit-button');
      expect(confirmButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should not call callbacks when buttons are disabled', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();

      render(
        <PayoutConfirmationModal
          {...defaultProps}
          onConfirm={onConfirm}
          onCancel={onCancel}
          isLoading={true}
        />
      );

      const cancelButton = screen.getByTestId('confirm-cancel-button');
      const confirmButton = screen.getByTestId('confirm-submit-button');

      fireEvent.press(cancelButton);
      fireEvent.press(confirmButton);

      expect(onConfirm).not.toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Detail Rows', () => {
    it('should display all three detail rows', () => {
      render(<PayoutConfirmationModal {...defaultProps} />);

      expect(screen.getByText('Amount:')).toBeTruthy();
      expect(screen.getByText('Currency:')).toBeTruthy();
      expect(screen.getByText('IBAN:')).toBeTruthy();
    });

    it('should display all values correctly', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          amount={500}
          currency="EUR"
          iban="FR1212345123451234567A123"
        />
      );

      expect(screen.getByTestId('confirm-amount')).toBeTruthy();
      expect(screen.getByTestId('confirm-currency')).toBeTruthy();
      expect(screen.getByTestId('confirm-iban')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero amount', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          amount={0}
        />
      );

      const amountElement = screen.getByTestId('confirm-amount');
      expect(amountElement.props.children).toBe('£0.00');
    });

    it('should handle decimal amounts correctly', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          amount={99.99}
        />
      );

      const amountElement = screen.getByTestId('confirm-amount');
      expect(amountElement.props.children).toBe('£99.99');
    });

    it('should handle very small IBANs', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          iban="GB82"
        />
      );

      const ibanElement = screen.getByTestId('confirm-iban');
      expect(ibanElement.props.children).toBe('GB82');
    });

    it('should handle exactly 8 character IBANs', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          iban="GB82WEST"
        />
      );

      const ibanElement = screen.getByTestId('confirm-iban');
      expect(ibanElement.props.children).toBe('GB82WEST');
    });

    it('should handle 9 character IBANs with masking', () => {
      render(
        <PayoutConfirmationModal
          {...defaultProps}
          iban="GB82WEST1"
        />
      );

      const ibanElement = screen.getByTestId('confirm-iban');
      expect(ibanElement.props.children).toBe('GB82*EST1');
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility labels on buttons', () => {
      render(<PayoutConfirmationModal {...defaultProps} />);

      const cancelButton = screen.getByTestId('confirm-cancel-button');
      const confirmButton = screen.getByTestId('confirm-submit-button');

      expect(cancelButton.props.accessibilityLabel).toBe('Cancel payout');
      expect(confirmButton.props.accessibilityLabel).toBe('Confirm and execute payout');
    });

    it('should have accessibility hints on buttons', () => {
      render(<PayoutConfirmationModal {...defaultProps} />);

      const cancelButton = screen.getByTestId('confirm-cancel-button');
      const confirmButton = screen.getByTestId('confirm-submit-button');

      expect(cancelButton.props.accessibilityHint).toBe('Double tap to go back and edit the payout details');
      expect(confirmButton.props.accessibilityHint).toBe('Double tap to confirm and process this payout');
    });
  });
});
