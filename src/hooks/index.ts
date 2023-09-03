import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { useNotice } from './notice';
import { GridCallbackDetails, GridPaginationModel } from '@mui/x-data-grid';
import { SortDirection } from '@mui/material';

export { useHeadMeta } from './meta';

export function useThrottle<T>(value: T, limit = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(function () {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

export const useRouterId = (): string | null => {
  const router = useRouter();
  const id = useMemo<string | null>(() => {
    if (!router?.query?.id) return null;
    return Array.isArray(router?.query?.id)
      ? router?.query?.id?.[0]
      : router?.query?.id;
  }, [router?.query?.id]);

  return id;
};

export const useCopy = (notify = true) => {
  const { showSuccess } = useNotice();
  const [, copy] = useCopyToClipboard();
  const onCopy = useCallback(
    async (value?: string | null) => {
      if (!value) return;
      await copy(value);
      notify && showSuccess(`已复制 ${value}`);
    },
    [copy, showSuccess, notify],
  );

  return onCopy;
};

type GridPagination = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
};
export function useGridPagination(params?: GridPagination) {
  const [pagination, setPagination] = useState<GridPagination>(
    params ?? {
      page: 0,
      pageSize: 100,
      sortBy: 'id',
      sortDirection: 'asc',
    },
  );

  const setPaginationModel = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (model: GridPaginationModel, _details: GridCallbackDetails<any>) => {
      setPagination({
        ...pagination,
        page: model.page,
        pageSize: model.pageSize,
      });
    },
    [pagination],
  );

  const setSortBy = useCallback(
    (sortBy: string) => {
      setPagination({ ...pagination, sortBy });
    },
    [pagination],
  );

  const setSortDirection = useCallback(
    (sortDirection: 'asc' | 'desc') => {
      setPagination({ ...pagination, sortDirection });
    },
    [pagination],
  );

  const reset = useCallback(() => {
    setPagination({
      page: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDirection: 'asc',
    });
  }, []);

  const skip = useMemo(
    () => pagination.page * pagination.pageSize,
    [pagination],
  );

  return {
    pagination,
    setPaginationModel,
    setSortBy,
    setSortDirection,
    reset,
    skip,
  };
}
