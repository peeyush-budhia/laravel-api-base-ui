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

export interface PaginatedResponse<T> {
  data: T[];
  errors: unknown;
  meta: PaginationMeta;
}
