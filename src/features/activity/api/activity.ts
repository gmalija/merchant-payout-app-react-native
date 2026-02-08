import { API_BASE_URL } from '@/shared/constants';
import type { PaginatedActivityResponse } from '@/shared/types/api';

/**
 * Fetch paginated activity items
 * @param cursor - The ID of the last item from previous page (null for first page)
 * @param limit - Number of items per page (default: 15)
 */
export async function fetchActivity(
  cursor: string | null = null,
  limit: number = 15
): Promise<PaginatedActivityResponse> {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);
  params.append('limit', String(limit));

  const response = await fetch(
    `${API_BASE_URL}/api/merchant/activity?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch activity: ${response.statusText}`);
  }

  return response.json();
}