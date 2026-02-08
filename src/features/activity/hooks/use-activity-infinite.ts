import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchActivity } from '../api/activity';
import type { PaginatedActivityResponse } from '@/shared/types/api';

export const ACTIVITY_QUERY_KEY = ['merchant', 'activity'] as const;

export function useActivityInfinite() {
  return useInfiniteQuery<PaginatedActivityResponse>({
    queryKey: ACTIVITY_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchActivity(pageParam as string | null, 15),
    getNextPageParam: (lastPage) => {
      return lastPage.has_more ? lastPage.next_cursor : undefined;
    },
    initialPageParam: null,
  });
}