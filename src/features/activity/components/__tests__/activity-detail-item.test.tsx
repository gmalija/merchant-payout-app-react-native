import { render, screen } from '@testing-library/react-native';
import { ActivityDetailItem } from '../activity-detail-item';
import type { ActivityItem } from '@/shared/types/api';

describe('ActivityDetailItem', () => {
  const mockActivity: ActivityItem = {
    id: 'act_001',
    type: 'deposit',
    amount: 150000,
    currency: 'GBP',
    date: '2024-01-15T10:30:00Z',
    description: 'Payment from Customer ABC',
    status: 'completed',
  };

  it('renders type, description, amount, and formatted date', () => {
    render(<ActivityDetailItem item={mockActivity} />);

    expect(screen.getByTestId('activity-type-act_001')).toHaveTextContent('Deposit');
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByTestId('activity-detail-amount-act_001')).toHaveTextContent(
      '£1,500.00'
    );
    expect(screen.getByTestId('activity-formatted-date-act_001')).toHaveTextContent(
      '15 Jan 2024'
    );
  });

  it('displays payout type correctly', () => {
    const payoutActivity: ActivityItem = {
      ...mockActivity,
      id: 'act_002',
      type: 'payout',
      amount: -50000,
    };

    render(<ActivityDetailItem item={payoutActivity} />);

    expect(screen.getByTestId('activity-type-act_002')).toHaveTextContent('Payout');
  });

  it('displays refund type correctly', () => {
    const refundActivity: ActivityItem = {
      ...mockActivity,
      id: 'act_003',
      type: 'refund',
      amount: -15000,
    };

    render(<ActivityDetailItem item={refundActivity} />);

    expect(screen.getByTestId('activity-type-act_003')).toHaveTextContent('Refund');
  });

  it('displays fee type correctly', () => {
    const feeActivity: ActivityItem = {
      ...mockActivity,
      id: 'act_004',
      type: 'fee',
      amount: -2500,
    };

    render(<ActivityDetailItem item={feeActivity} />);

    expect(screen.getByTestId('activity-type-act_004')).toHaveTextContent('Fee');
  });

  it('renders negative amounts correctly', () => {
    const negativeActivity: ActivityItem = {
      ...mockActivity,
      amount: -50000,
    };

    render(<ActivityDetailItem item={negativeActivity} />);

    expect(screen.getByTestId('activity-detail-amount-act_001')).toHaveTextContent(
      '-£500.00'
    );
  });

  it('renders positive amounts correctly', () => {
    render(<ActivityDetailItem item={mockActivity} />);

    expect(screen.getByTestId('activity-detail-amount-act_001')).toHaveTextContent(
      '£1,500.00'
    );
  });

  it('formats EUR currency correctly', () => {
    const eurActivity: ActivityItem = {
      ...mockActivity,
      currency: 'EUR',
    };

    render(<ActivityDetailItem item={eurActivity} />);

    expect(screen.getByTestId('activity-detail-amount-act_001')).toHaveTextContent(
      '€1,500.00'
    );
  });
});
