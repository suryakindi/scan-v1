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
