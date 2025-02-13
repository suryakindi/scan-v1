import type { RouteProps } from "react-router";

type ModuleT =
  | "Registrasi"
  | "Pasien"
  | "Rekam-Medis"
  | "Integrasi-Tools"
  | "Management-Client"
  | "Apotek"
  | "Laboratorium";

interface PermissionT {
  module: ModuleT;
  can_view: boolean;
  can_edit: boolean;
  can_create: boolean;
  can_delete: boolean;
}

type WrapRoutePropsT = RouteProps & {
  path: string;
  name: string;
  module:
    | "Registrasi"
    | "Pasien"
    | "Rekam-Medis"
    | "Integrasi-Tools"
    | "Management-Client"
    | "Apotek"
    | "Laboratorium";
  childs?: WrapRoutePropsT[];
};

const routes: WrapRoutePropsT[] = [
  {
    path: "registrasi",
    name: "Registrasi",
    module: "Registrasi",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Registrasi",
        childs: [{ name: "sub-sub", module: "Registrasi", path: "sub-sub" }],
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Registrasi",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Registrasi",
      },
    ],
  },
  {
    path: "pasien",
    name: "Pasien",
    module: "Pasien",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Pasien",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Pasien",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Pasien",
      },
    ],
  },
  {
    path: "rekam-medis",
    name: "Rekam Medis",
    module: "Rekam-Medis",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Rekam-Medis",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Rekam-Medis",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Rekam-Medis",
      },
    ],
  },
  {
    path: "integrasi-tools",
    name: "Integrasi Tools",
    module: "Integrasi-Tools",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Integrasi-Tools",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Integrasi-Tools",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Integrasi-Tools",
      },
    ],
  },
  {
    path: "management-client",
    name: "Management Client",
    module: "Management-Client",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Management-Client",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Management-Client",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Management-Client",
      },
    ],
  },
  {
    path: "apotek",
    name: "Apotek",
    module: "Apotek",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Apotek",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Apotek",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Apotek",
      },
    ],
  },
  {
    path: "laboratorium",
    name: "Laboratorium",
    module: "Laboratorium",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Laboratorium",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Laboratorium",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Laboratorium",
      },
    ],
  },
];

export const routeBuilder = (permissions: PermissionT[]) => {
  const parsed_permissions = permissions.reduce(
    (acc, { module, can_create, can_delete, can_edit, can_view }) => {
      acc[module as WrapRoutePropsT["module"]] = {
        can_create,
        can_delete,
        can_edit,
        can_view,
      };
      return acc;
    },
    {} as Record<
      WrapRoutePropsT["module"],
      {
        can_create: boolean;
        can_delete: boolean;
        can_edit: boolean;
        can_view: boolean;
      }
    >
  );

  const bulder = (routes: WrapRoutePropsT[]): WrapRoutePropsT[] => {
    return routes.map((x) => ({
      ...x,
      permissions: parsed_permissions[x.module] ?? {
        can_create: false,
        can_delete: false,
        can_edit: false,
        can_view: false,
      },
      ...(x.childs ? { childs: bulder(x.childs) } : {}),
    }));
  };

  return bulder(routes);
};

export type { ModuleT, PermissionT, WrapRoutePropsT };
