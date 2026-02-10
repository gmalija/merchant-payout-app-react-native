import { render, screen } from '@testing-library/react-native';
import { ScreenContainer } from '../screen-container';
import { Text } from 'react-native';

describe('ScreenContainer', () => {
  it('should render children', () => {
    render(
      <ScreenContainer>
        <Text>Test Content</Text>
      </ScreenContainer>
    );

    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('should render with testID', () => {
    render(
      <ScreenContainer testID="test-container">
        <Text>Content</Text>
      </ScreenContainer>
    );

    expect(screen.getByTestId('test-container')).toBeTruthy();
  });

  it('should render with default edges', () => {
    const { UNSAFE_getByType } = render(
      <ScreenContainer>
        <Text>Content</Text>
      </ScreenContainer>
    );

    const { SafeAreaView } = require('react-native-safe-area-context');
    const safeAreaView = UNSAFE_getByType(SafeAreaView);
    expect(safeAreaView).toBeTruthy();
    expect(safeAreaView.props.edges).toEqual(['top', 'left', 'right']);
  });

  it('should render with custom edges', () => {
    const { UNSAFE_getByType } = render(
      <ScreenContainer edges={['bottom']}>
        <Text>Content</Text>
      </ScreenContainer>
    );

    const { SafeAreaView } = require('react-native-safe-area-context');
    const safeAreaView = UNSAFE_getByType(SafeAreaView);
    expect(safeAreaView.props.edges).toEqual(['bottom']);
  });

  it('should render multiple children', () => {
    render(
      <ScreenContainer>
        <Text>First</Text>
        <Text>Second</Text>
        <Text>Third</Text>
      </ScreenContainer>
    );

    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
    expect(screen.getByText('Third')).toBeTruthy();
  });
});
