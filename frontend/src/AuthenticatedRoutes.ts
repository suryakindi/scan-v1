import { RouteObject } from "react-router";
import LazyLoad from "./components/LazyLoad";
import { permissions } from "./permissions";

const make = async ({ module }: LoaderMakeT = {}) => {
  // const token = localStorage.getItem("token") ?? "";
  const permission = permissions.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.module]: {
        module: curr.module,
        can_view: acc[curr.module]?.can_view || curr.can_view || false,
        can_edit: acc[curr.module]?.can_edit || curr.can_edit || false,
        can_create: acc[curr.module]?.can_create || curr.can_create || false,
        can_delete: acc[curr.module]?.can_delete || curr.can_delete || false,
      },
    }),
    {} as Record<ModuleT, PermissionT>
  )[(module ?? "") as ModuleT] ?? {
    module: null,
    can_view: true,
    can_edit: true,
    can_create: true,
    can_delete: true,
  };

  return { permission } as LoaderT;
};

export const AuthenticatedRoutes: RouteObject[] = [
  {
    path: "/",
    element: LazyLoad(() => import("./pages/Dashboard")),
    loader: () => make(),
  },
  {
    path: "/pasien",
    children: [
      {
        index: true,
        element: LazyLoad(() => import("./pages/pasien/index")),
        loader: () => make(),
      },
    ],
  },
  {
    children: [
      {
        path: "/bpjs/kunjungan",
        element: LazyLoad(() => import("./pages/bpjs/kunjungan")),
        loader: () => make(),
      },
      {
        path: "/bpjs/dokter",
        element: LazyLoad(() => import("./pages/bpjs/dokter")),
        loader: () => make(),
      },
      {
        path: "/bpjs/hfis",
        element: LazyLoad(() => import("./pages/bpjs/hfis")),
        loader: () => make(),
      },
      {
        path: "/bpjs/tindakan",
        element: LazyLoad(() => import("./pages/bpjs/tindakan")),
        loader: () => make(),
      },
      {
        path: "/bpjs/prolanis",
        element: LazyLoad(() => import("./pages/bpjs/prolanis")),
        loader: () => make(),
      },
    ],
  },
];
