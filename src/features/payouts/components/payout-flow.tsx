import { useState } from 'react';
import { PayoutForm } from './payout-form';
import { PayoutConfirmationModal } from './payout-confirmation-modal';
import { PayoutSuccess, PayoutError, InsufficientFunds } from './payout-result';
import { useCreatePayout } from '../hooks/use-create-payout';
import { useMerchantData } from '@/features/merchant';
import type { Currency } from '@/shared/types/api';

type FlowState = 'form' | 'confirming' | 'success' | 'error' | 'insufficient_funds';

interface PayoutData {
  amount: number;
  currency: Currency;
  iban: string;
}

export function PayoutFlow() {
  const [flowState, setFlowState] = useState<FlowState>('form');
  const [payoutData, setPayoutData] = useState<PayoutData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const createPayout = useCreatePayout();
  const { data: merchantData } = useMerchantData();

  // Handle form submission (show confirmation modal)
  const handleFormSubmit = (data: PayoutData) => {
    setPayoutData(data);
    setFlowState('confirming');
  };

  // Handle confirmation (execute payout)
  const handleConfirm = async () => {
    if (!payoutData) return;

    // Check for insufficient funds
    if (merchantData) {
      const availableInPence = merchantData.available_balance;
      const requestedInPence = payoutData.amount * 100;

      if (requestedInPence > availableInPence) {
        setFlowState('insufficient_funds');
        return;
      }
    }

    try {
      // Create payout (amount in API is in pence/cents)
      await createPayout.mutateAsync({
        amount: Math.round(payoutData.amount * 100),
        currency: payoutData.currency,
        iban: payoutData.iban,
      });

      setFlowState('success');
    } catch (error: any) {
      // Handle different error types
      const errorMsg = error?.message || 'An unexpected error occurred. Please try again.';

      // Check if it's an insufficient funds error from API
      if (errorMsg.toLowerCase().includes('insufficient')) {
        setFlowState('insufficient_funds');
      } else {
        setErrorMessage(errorMsg);
        setFlowState('error');
      }
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirmation = () => {
    setFlowState('form');
  };

  // Handle retry after error
  const handleRetry = () => {
    setFlowState('form');
    setErrorMessage('');
  };

  // Handle done after success
  const handleDone = () => {
    setFlowState('form');
    setPayoutData(null);
  };

  // Handle back from insufficient funds
  const handleBackFromInsufficientFunds = () => {
    setFlowState('form');
  };

  // Get default currency from merchant data
  const defaultCurrency = merchantData?.currency || 'GBP';

  return (
    <>
      {/* Form State */}
      {flowState === 'form' && (
        <PayoutForm
          onSubmit={handleFormSubmit}
          isLoading={false}
          defaultCurrency={defaultCurrency}
        />
      )}

      {/* Confirmation Modal */}
      {flowState === 'confirming' && payoutData && (
        <PayoutConfirmationModal
          visible={true}
          amount={payoutData.amount}
          currency={payoutData.currency}
          iban={payoutData.iban}
          isLoading={createPayout.isPending}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirmation}
        />
      )}

      {/* Success State */}
      {flowState === 'success' && payoutData && createPayout.data && (
        <PayoutSuccess
          amount={payoutData.amount}
          currency={payoutData.currency}
          payoutId={createPayout.data.id}
          onDone={handleDone}
        />
      )}

      {/* Error State */}
      {flowState === 'error' && (
        <PayoutError error={errorMessage} onRetry={handleRetry} onCancel={handleDone} />
      )}

      {/* Insufficient Funds State */}
      {flowState === 'insufficient_funds' && payoutData && merchantData && (
        <InsufficientFunds
          requestedAmount={payoutData.amount}
          currency={payoutData.currency}
          availableBalance={merchantData.available_balance / 100}
          onCancel={handleBackFromInsufficientFunds}
        />
      )}
    </>
  );
}