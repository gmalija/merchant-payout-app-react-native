import { render, screen } from '@testing-library/react-native';
import { ScreenHeader } from '../screen-header';
import { Text } from 'react-native';

describe('ScreenHeader', () => {
  it('should render title', () => {
    render(<ScreenHeader title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('should render title and subtitle', () => {
    render(<ScreenHeader title="Main Title" subtitle="Subtitle text" />);

    expect(screen.getByText('Main Title')).toBeTruthy();
    expect(screen.getByText('Subtitle text')).toBeTruthy();
  });

  it('should not render subtitle when not provided', () => {
    render(<ScreenHeader title="Title Only" />);

    expect(screen.getByText('Title Only')).toBeTruthy();
  });

  it('should render action component', () => {
    render(
      <ScreenHeader
        title="Title"
        action={<Text testID="action-button">Action</Text>}
      />
    );

    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByTestId('action-button')).toBeTruthy();
  });

  it('should render title, subtitle, and action together', () => {
    render(
      <ScreenHeader
        title="Main Title"
        subtitle="Subtitle"
        action={<Text>Button</Text>}
      />
    );

    expect(screen.getByText('Main Title')).toBeTruthy();
    expect(screen.getByText('Subtitle')).toBeTruthy();
    expect(screen.getByText('Button')).toBeTruthy();
  });

  it('should apply custom spacing', () => {
    const { UNSAFE_getByType } = render(
      <ScreenHeader title="Title" spacing={50} />
    );

    const { ThemedView } = require('@/shared/components/ui/themed-view');
    const themedView = UNSAFE_getByType(ThemedView);
    expect(themedView.props.style).toMatchObject({ marginBottom: 50 });
  });
});
