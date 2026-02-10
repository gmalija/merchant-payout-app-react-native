import { render, screen, waitFor } from '@testing-library/react-native';
import { QueryProvider, queryClient } from '../query-provider';
import { useQuery } from '@tanstack/react-query';
import { Text } from 'react-native';

// Test component that uses React Query
function TestComponent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      return { message: 'Test data' };
    },
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error</Text>;
  return <Text>{data?.message}</Text>;
}

describe('QueryProvider', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('should provide QueryClient to children', async () => {
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Test data')).toBeTruthy();
    });
  });

  it('should render children', () => {
    render(
      <QueryProvider>
        <Text>Child Component</Text>
      </QueryProvider>
    );

    expect(screen.getByText('Child Component')).toBeTruthy();
  });

  it('should export queryClient', () => {
    expect(queryClient).toBeDefined();
    expect(typeof queryClient.getQueryData).toBe('function');
    expect(typeof queryClient.setQueryData).toBe('function');
    expect(typeof queryClient.invalidateQueries).toBe('function');
  });

  it('should have correct default options', () => {
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.retry).toBe(2);
    expect(defaultOptions.queries?.staleTime).toBe(30000);
    expect(defaultOptions.queries?.gcTime).toBe(5 * 60 * 1000);
  });

  it('should handle multiple queries independently', async () => {
    function MultiQueryComponent() {
      const query1 = useQuery({
        queryKey: ['query1'],
        queryFn: async () => ({ value: 'First' }),
      });

      const query2 = useQuery({
        queryKey: ['query2'],
        queryFn: async () => ({ value: 'Second' }),
      });

      if (query1.isLoading || query2.isLoading) {
        return <Text>Loading...</Text>;
      }

      return (
        <>
          <Text>{query1.data?.value}</Text>
          <Text>{query2.data?.value}</Text>
        </>
      );
    }

    render(
      <QueryProvider>
        <MultiQueryComponent />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('First')).toBeTruthy();
      expect(screen.getByText('Second')).toBeTruthy();
    });
  });

  it('should cache query results', async () => {
    const queryFn = jest.fn(async () => ({ data: 'Cached' }));

    function CachedComponent() {
      const { data, isLoading } = useQuery({
        queryKey: ['cached'],
        queryFn,
      });

      if (isLoading) return <Text>Loading...</Text>;
      return <Text>{data?.data}</Text>;
    }

    const { unmount, rerender } = render(
      <QueryProvider>
        <CachedComponent />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Cached')).toBeTruthy();
    });

    expect(queryFn).toHaveBeenCalledTimes(1);

    // Rerender should use cached data
    rerender(
      <QueryProvider>
        <CachedComponent />
      </QueryProvider>
    );

    expect(screen.getByText('Cached')).toBeTruthy();
    expect(queryFn).toHaveBeenCalledTimes(1); // Still only called once

    unmount();
  });
});
