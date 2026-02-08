import { render, screen } from '@testing-library/react-native';
import { BalanceCard } from '../balance-card';

describe('BalanceCard', () => {
  it('renders available and pending balance', () => {
    render(
      <BalanceCard
        availableBalance={500000}
        pendingBalance={25000}
        currency="GBP"
      />
    );

    expect(screen.getByTestId('available-balance')).toHaveTextContent('£5,000.00');
    expect(screen.getByTestId('pending-balance')).toHaveTextContent('£250.00');
  });

  it('renders EUR currency correctly', () => {
    render(
      <BalanceCard
        availableBalance={500000}
        pendingBalance={25000}
        currency="EUR"
      />
    );

    expect(screen.getByTestId('available-balance')).toHaveTextContent('€5,000.00');
    expect(screen.getByTestId('pending-balance')).toHaveTextContent('€250.00');
  });

  it('renders zero balances correctly', () => {
    render(
      <BalanceCard availableBalance={0} pendingBalance={0} currency="GBP" />
    );

    expect(screen.getByTestId('available-balance')).toHaveTextContent('£0.00');
    expect(screen.getByTestId('pending-balance')).toHaveTextContent('£0.00');
  });
});
