import { render, screen } from '@testing-library/react-native';
import { LoadingState } from '../loading-state';

describe('LoadingState', () => {
  it('renders with default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeTruthy();
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders with custom message', () => {
    render(<LoadingState message="Please wait" />);
    expect(screen.getByText('Please wait')).toBeTruthy();
  });

  it('renders with custom testID', () => {
    render(<LoadingState testID="custom-loader" />);
    expect(screen.getByTestId('custom-loader')).toBeTruthy();
  });

  it('renders without message when empty string provided', () => {
    render(<LoadingState message="" />);
    expect(screen.queryByText('Loading...')).toBeNull();
  });
});
