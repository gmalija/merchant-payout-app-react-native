/**
 * Card Component Tests
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../card';

describe('Card', () => {
  it('should render children correctly', () => {
    render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );

    expect(screen.getByText('Card Content')).toBeTruthy();
  });

  it('should render with default variant (filled)', () => {
    render(
      <Card>
        <Text>Content</Text>
      </Card>
    );

    const card = screen.getByText('Content').parent;
    expect(card).toBeTruthy();
  });

  it('should accept custom padding', () => {
    render(
      <Card padding={20} testID="custom-card">
        <Text>Content</Text>
      </Card>
    );

    const card = screen.getByTestId('custom-card');
    const styleString = JSON.stringify(card.props.style);
    expect(styleString).toContain('"padding":20');
  });

  it('should apply custom styles', () => {
    const customStyle = { marginTop: 10 };
    render(
      <Card style={customStyle} testID="styled-card">
        <Text>Content</Text>
      </Card>
    );

    const card = screen.getByTestId('styled-card');
    const styleString = JSON.stringify(card.props.style);
    expect(styleString).toContain('"marginTop":10');
  });

  it('should render multiple children', () => {
    render(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
        <Text>Third Child</Text>
      </Card>
    );

    expect(screen.getByText('First Child')).toBeTruthy();
    expect(screen.getByText('Second Child')).toBeTruthy();
    expect(screen.getByText('Third Child')).toBeTruthy();
  });

  it('should render empty card', () => {
    render(<Card testID="empty-card" />);

    const card = screen.getByTestId('empty-card');
    expect(card).toBeTruthy();
  });

  it('should pass through additional props', () => {
    render(
      <Card testID="card-with-props" accessible={true} accessibilityLabel="Test Card">
        <Text>Content</Text>
      </Card>
    );

    const card = screen.getByTestId('card-with-props');
    expect(card.props.accessible).toBe(true);
    expect(card.props.accessibilityLabel).toBe('Test Card');
  });
});
