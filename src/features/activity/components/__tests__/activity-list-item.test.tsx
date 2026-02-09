import { render, screen } from '@testing-library/react-native';
import { ActivityListItem } from '../activity-list-item';
import type { ActivityItem } from '@/shared/types/api';

describe('ActivityListItem', () => {
  const mockActivity: ActivityItem = {
    id: 'act_001',
    type: 'deposit',
    amount: 150000,
    currency: 'GBP',
    date: '2024-01-15T10:30:00Z',
    description: 'Payment from Customer ABC',
    status: 'completed',
  };

  it('renders activity description and amount', () => {
    render(<ActivityListItem item={mockActivity} />);

    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByTestId('activity-amount-act_001')).toHaveTextContent('£1,500.00');
  });

  it('does not show date by default', () => {
    render(<ActivityListItem item={mockActivity} />);

    expect(screen.queryByTestId('activity-date-act_001')).toBeNull();
  });

  it('shows date when showDate is true', () => {
    render(<ActivityListItem item={mockActivity} showDate />);

    expect(screen.getByTestId('activity-date-act_001')).toHaveTextContent(
      '2024-01-15T10:30:00Z'
    );
  });

  it('renders negative amounts with correct styling', () => {
    const negativeActivity: ActivityItem = {
      ...mockActivity,
      amount: -50000,
    };

    render(<ActivityListItem item={negativeActivity} />);

    expect(screen.getByTestId('activity-amount-act_001')).toHaveTextContent('-£500.00');
  });

  it('renders positive amounts with correct styling', () => {
    render(<ActivityListItem item={mockActivity} />);

    expect(screen.getByTestId('activity-amount-act_001')).toHaveTextContent('£1,500.00');
  });
});
