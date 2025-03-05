import type { RouteObject } from "react-router";
import { userLoader, type ModuleT } from "./user";
import type { FC } from "react";
import * as HOutline from "@heroicons/react/24/outline";
import LazyLoad from "./components/LazyLoad";
// import * as HSolid from "@heroicons/react/24/solid";

type WrapRoute = RouteObject & {
  name?: string;
  nav?: boolean;
  module?: ModuleT;
  children?: WrapRoute[];
  Icon?: FC<React.SVGProps<SVGSVGElement>>;
};

const appendLoader = (routes: WrapRoute[]): WrapRoute[] =>
  routes.map(
    (route) =>
      ({
        ...route,
        ...(route.module
          ? {
              loader: (args) => userLoader(args, route.module),
            }
          : {}),
        ...(route.children ? { children: appendLoader(route.children) } : {}),
      } as WrapRoute)
  );

const raw: WrapRoute[] = [
  {
    path: "/registrasi",
    name: "Registrasi",
    nav: true,
    Icon: HOutline.UserPlusIcon,
    children: [
      {
        path: "/registrasi/pasien",
        name: "Pasien Baru",
        nav: true,
        module: "Registrasi",
        element: LazyLoad(() => import("./pages/registrasi/pasien/index")),
      },
    ],
  },
  {
    path: "/management-client",
    name: "Management Client",
    nav: true,
    Icon: HOutline.UsersIcon,
    children: [
      {
        path: "/management-client/client",
        nav: true,
        name: "Client",
        children: [
          {
            index: true,
            module: "Integrasi-Tools",
            element: LazyLoad(
              () => import("./pages/management-client/client/index")
            ),
          },
          {
            path: "/management-client/client/add",
            module: "Integrasi-Tools",
            element: LazyLoad(
              () => import("./pages/management-client/client/add")
            ),
          },
          {
            path: "/management-client/client/details/:id",
            module: "Integrasi-Tools",
            element: LazyLoad(
              () => import("./pages/management-client/client/details")
            ),
          },
        ],
      },
      {
        path: "/management-client/base-url",
        nav: true,
        name: "Base URL",
        children: [
          {
            index: true,
            module: "Integrasi-Tools",
            element: LazyLoad(
              () => import("./pages/management-client/base-url/index")
            ),
          },
        ],
      },
    ],
  },
];

export type { WrapRoute };

export const routes = appendLoader(raw);
