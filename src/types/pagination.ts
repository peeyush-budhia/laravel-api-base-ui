import type { ApiResponse } from '../api/types';

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  path: string;
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta: PaginationMeta;
};
