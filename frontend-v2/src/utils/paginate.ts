import { Paginate } from "./global-types";

export default {
  init<T = unknown>(data: T[] = []): Paginate<T[]> {
    return {
      current_page: 0,
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
      data,
    };
  },
};
