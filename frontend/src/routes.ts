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
        module: "Registrasi",
        element: LazyLoad(() => import("./pages/registrasi/pasien/index")),
      },
      {
        path: "/registrasi/list",
        name: "List Pasien",
        nav: true,
        module: "Registrasi",
        element: LazyLoad(() => import("./pages/registrasi/pasien/list")),
      },
      {
        path: "/registrasi/form/:id",
        name: "Registration Form",
        module: "Registrasi",
        element: LazyLoad(() => import("./pages/registrasi/pasien/form")),
      },
      {
        path: "/registrasi/form/:id/edit",
        name: "Edit Registration Form",
        module: "Registrasi",
        element: LazyLoad(() => import("./pages/registrasi/pasien/form-edit")),
      },
      {
        path: "/registrasi/kunjungan",
        name: "Kunjungan",
        nav: true,
        module: "Registrasi",
        element: LazyLoad(() => import("./pages/registrasi/pasien/kunjungan")),
      },
      {
        path: "/registrasi/soap",
        name: "SOAP",
        module: "Registrasi",
        element: LazyLoad(() => import("./pages/registrasi/pasien/soap")),
      },
      {
        path: "/registrasi/details/:id",
        name: "Detail Pasien",
        module: "Registrasi",
        element: LazyLoad(
          () => import("./pages/registrasi/pasien/details/index")
        ),
      },
    ],
  },
  {
    path: "/layanan",
    name: "Layanan",
    nav: true,
    children: [
      {
        path: "/layanan/rawat-jalan",
        name: "Rawat Jalan",
        nav: true,
        element: LazyLoad(() => import("./pages/layanan/rawat-jalan")),
      },
      {
        path: "/layanan/rawat-inap",
        name: "Rawat Inap",
        nav: true,
        element: LazyLoad(() => import("./pages/layanan/rawat-inap")),
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
