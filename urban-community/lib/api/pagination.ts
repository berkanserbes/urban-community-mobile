import type { InfiniteData } from '@tanstack/react-query';
import type { PagedResult } from '@/types/api.types';

/** Matches the backend default; the backend rejects anything above 100. */
export const DEFAULT_PAGE_SIZE = 20;

export interface LoadedPages<T> {
  items: T[];
  totalCount: number;
}

/** useInfiniteQuery getNextPageParam: the next 1-based page, or undefined after the last one. */
export function getNextPageParam(lastPage: PagedResult<unknown>): number | undefined {
  return lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined;
}

/**
 * useInfiniteQuery select: joins the loaded pages into one list. Records added or
 * reordered while the user scrolls shift items between pages, so repeated ids are dropped.
 */
export function selectLoadedPages<T extends { id: string }>(
  data: InfiniteData<PagedResult<T>>,
): LoadedPages<T> {
  const seen = new Set<string>();
  const items = data.pages
    .flatMap((page) => page.items)
    .filter((item) => !seen.has(item.id) && Boolean(seen.add(item.id)));

  return { items, totalCount: data.pages[data.pages.length - 1]?.totalCount ?? 0 };
}

export function mapPagedResult<T, U>(page: PagedResult<T>, map: (item: T) => U): PagedResult<U> {
  return { ...page, items: page.items.map(map) };
}

/** FlatList onEndReached handler that loads the next page once. */
export function loadNextPage(query: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
}) {
  if (query.hasNextPage && !query.isFetchingNextPage) {
    query.fetchNextPage();
  }
}
