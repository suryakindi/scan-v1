type PaginateLinkT = {
  url: string | null;
  label: string;
  active: boolean;
};

type PaginateT<T = []> = {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginateLinkT[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  data: T;
};

export type { PaginateLinkT, PaginateT };

export const paginateInit = <T = unknown>(data: T[] = []): PaginateT<T[]> => ({
  current_page: 0,
  data,
  first_page_url: "",
  from: 0,
  last_page: 0,
  last_page_url: "",
  links: [],
  next_page_url: null,
  path: "",
  per_page: 0,
  prev_page_url: null,
  to: 0,
  total: 0,
});
