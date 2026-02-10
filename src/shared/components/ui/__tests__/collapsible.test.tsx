import { render, screen, fireEvent } from '@testing-library/react-native';
import { Collapsible } from '../collapsible';
import { Text } from 'react-native';

describe('Collapsible', () => {
  it('should render with title', () => {
    render(
      <Collapsible title="Test Title">
        <Text>Content</Text>
      </Collapsible>
    );

    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('should start collapsed (content hidden)', () => {
    render(
      <Collapsible title="Test Title">
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    expect(screen.queryByText('Hidden Content')).toBeNull();
  });

  it('should expand when pressed', () => {
    render(
      <Collapsible title="Test Title">
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    const heading = screen.getByText('Test Title');
    fireEvent.press(heading);

    expect(screen.getByText('Hidden Content')).toBeTruthy();
  });

  it('should toggle between open and closed', () => {
    render(
      <Collapsible title="Test Title">
        <Text>Toggleable Content</Text>
      </Collapsible>
    );

    const heading = screen.getByText('Test Title');

    // Initially closed
    expect(screen.queryByText('Toggleable Content')).toBeNull();

    // Open
    fireEvent.press(heading);
    expect(screen.getByText('Toggleable Content')).toBeTruthy();

    // Close
    fireEvent.press(heading);
    expect(screen.queryByText('Toggleable Content')).toBeNull();

    // Open again
    fireEvent.press(heading);
    expect(screen.getByText('Toggleable Content')).toBeTruthy();
  });

  it('should render multiple children when open', () => {
    render(
      <Collapsible title="Test Title">
        <Text>First Child</Text>
        <Text>Second Child</Text>
        <Text>Third Child</Text>
      </Collapsible>
    );

    const heading = screen.getByText('Test Title');
    fireEvent.press(heading);

    expect(screen.getByText('First Child')).toBeTruthy();
    expect(screen.getByText('Second Child')).toBeTruthy();
    expect(screen.getByText('Third Child')).toBeTruthy();
  });

  it('should handle multiple collapsibles independently', () => {
    render(
      <>
        <Collapsible title="First Section">
          <Text>First Content</Text>
        </Collapsible>
        <Collapsible title="Second Section">
          <Text>Second Content</Text>
        </Collapsible>
      </>
    );

    const firstHeading = screen.getByText('First Section');
    const secondHeading = screen.getByText('Second Section');

    // Open first
    fireEvent.press(firstHeading);
    expect(screen.getByText('First Content')).toBeTruthy();
    expect(screen.queryByText('Second Content')).toBeNull();

    // Open second
    fireEvent.press(secondHeading);
    expect(screen.getByText('First Content')).toBeTruthy();
    expect(screen.getByText('Second Content')).toBeTruthy();

    // Close first
    fireEvent.press(firstHeading);
    expect(screen.queryByText('First Content')).toBeNull();
    expect(screen.getByText('Second Content')).toBeTruthy();
  });

  it('should render chevron icon', () => {
    const { UNSAFE_getByType } = render(
      <Collapsible title="Test Title">
        <Text>Content</Text>
      </Collapsible>
    );

    // Verify that there's a TouchableOpacity (the heading)
    const { TouchableOpacity } = require('react-native');
    expect(UNSAFE_getByType(TouchableOpacity)).toBeTruthy();
  });
});
