import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../button';

describe('Button', () => {
  it('renders button with title', () => {
    render(<Button title="Click me" />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Click me" onPress={onPress} />);

    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Click me" onPress={onPress} disabled />);

    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    render(<Button title="Click me" loading />);
    expect(screen.queryByText('Click me')).toBeNull();
  });

  it('renders with testID', () => {
    render(<Button title="Click me" testID="test-button" />);
    expect(screen.getByTestId('test-button')).toBeTruthy();
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(<Button title="Primary" variant="primary" />);
    expect(screen.getByText('Primary')).toBeTruthy();

    rerender(<Button title="Secondary" variant="secondary" />);
    expect(screen.getByText('Secondary')).toBeTruthy();

    rerender(<Button title="Outline" variant="outline" />);
    expect(screen.getByText('Outline')).toBeTruthy();

    rerender(<Button title="Ghost" variant="ghost" />);
    expect(screen.getByText('Ghost')).toBeTruthy();
  });
});
