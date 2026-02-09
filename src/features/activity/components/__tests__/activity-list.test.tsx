import { render, screen, fireEvent } from '@testing-library/react-native';
import { ActivityList } from '../activity-list';
import type { ActivityItem } from '@/shared/types/api';

describe('ActivityList', () => {
  const mockActivities: ActivityItem[] = [
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
    {
      id: 'act_003',
      type: 'deposit',
      amount: 230000,
      currency: 'GBP',
      date: '2024-01-13T10:30:00Z',
      description: 'Payment from Customer XYZ',
      status: 'completed',
    },
  ];

  it('renders all activity items', () => {
    render(<ActivityList items={mockActivities} />);

    expect(screen.getByTestId('activity-item-act_001')).toBeTruthy();
    expect(screen.getByTestId('activity-item-act_002')).toBeTruthy();
    expect(screen.getByTestId('activity-item-act_003')).toBeTruthy();
  });

  it('renders empty state when no activities', () => {
    render(<ActivityList items={[]} />);

    expect(screen.getByText('No recent activity')).toBeTruthy();
  });

  it('renders show more button when onShowMore is provided', () => {
    const onShowMore = jest.fn();
    render(<ActivityList items={mockActivities} onShowMore={onShowMore} />);

    expect(screen.getByTestId('show-more-button')).toBeTruthy();
  });

  it('calls onShowMore when show more button is pressed', () => {
    const onShowMore = jest.fn();
    render(<ActivityList items={mockActivities} onShowMore={onShowMore} />);

    fireEvent.press(screen.getByTestId('show-more-button'));

    expect(onShowMore).toHaveBeenCalledTimes(1);
  });

  it('does not render show more button when onShowMore is not provided', () => {
    render(<ActivityList items={mockActivities} />);

    expect(screen.queryByTestId('show-more-button')).toBeNull();
  });
});
