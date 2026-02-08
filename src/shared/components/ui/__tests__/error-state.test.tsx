import { render, screen, fireEvent } from '@testing-library/react-native';
import { ErrorState } from '../error-state';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('renders retry button when onRetry provided', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);
    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('calls onRetry when retry button pressed', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);

    fireEvent.press(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry not provided', () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByText('Retry')).toBeNull();
  });

  it('renders with custom retry label', () => {
    render(<ErrorState message="Error" onRetry={jest.fn()} retryLabel="Try Again" />);
    expect(screen.getByText('Try Again')).toBeTruthy();
  });

  it('renders with custom testID', () => {
    render(<ErrorState message="Error" testID="custom-error" />);
    expect(screen.getByTestId('custom-error')).toBeTruthy();
  });
});
