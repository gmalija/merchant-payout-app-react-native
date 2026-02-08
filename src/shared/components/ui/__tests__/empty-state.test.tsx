import { render, screen } from '@testing-library/react-native';
import { EmptyState } from '../empty-state';

describe('EmptyState', () => {
  it('renders empty message', () => {
    render(<EmptyState message="No items found" />);
    expect(screen.getByText('No items found')).toBeTruthy();
  });

  it('renders with custom testID', () => {
    render(<EmptyState message="Empty" testID="custom-empty" />);
    expect(screen.getByTestId('custom-empty')).toBeTruthy();
  });
});
