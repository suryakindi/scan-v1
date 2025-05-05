import type { RouteObject } from "react-router";

type BaseService = { loader: RouteObject["loader"] };

export const baseService = {
  async loader() {},
} as BaseService;

export type { BaseService };
