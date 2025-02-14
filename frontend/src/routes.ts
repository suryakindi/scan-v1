import type { RouteProps } from "react-router";
import Dummy from "./pages/Dummy";
import { ComponentType } from "react";

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

interface ComponentPropsT {
  permissions?: Omit<PermissionT, "module">;
  name?: string;
}

type WrapRoutePropsT = RouteProps & {
  path: string;
  name: string;
  module: ModuleT;
  Component?: ComponentType<ComponentPropsT>;
  permissions: Omit<PermissionT, "module">;
  childs?: WrapRoutePropsT[];
};

type RawWrapRoutePropsT = Omit<WrapRoutePropsT, "permissions" | "childs"> & {
  childs?: RawWrapRoutePropsT[];
};

/**
 * 📌 Dokumentasi Routes (BACA DULU, GWA TABOK LU!)
 *
 * 🛑 ATURAN PENTING 🛑
 *
 * YANG BOLEH DIEDIT CUMA ISI DIDALAM routes!
 *
 * Jangan utak-atik struktur data, kecuali mau kena tabok!
 * Jangan ubah routeBuilder, kecuali siap berantem!
 * Jangan sentuh tipe data WrapRoutePropsT atau RawWrapRoutePropsT tanpa alasan kuat!
 *
 * UDAH SUSAH-SUSAH GW BUAT, JANGAN SAMPE KACAU!
 * LU GAK TAU AJA BETE NYUSUN INI! 😤🔥
 */

const routes: RawWrapRoutePropsT[] = [
  {
    path: "registrasi",
    name: "Registrasi",
    module: "Registrasi",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Registrasi",
        Component: Dummy,
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Registrasi",
        Component: Dummy,
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Registrasi",
        Component: Dummy,
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
        Component: Dummy,
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Pasien",
        Component: Dummy,
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Pasien",
        Component: Dummy,
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
        Component: Dummy,
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Rekam-Medis",
        Component: Dummy,
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Rekam-Medis",
        Component: Dummy,
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
        Component: Dummy,
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Integrasi-Tools",
        Component: Dummy,
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Integrasi-Tools",
        Component: Dummy,
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
        Component: Dummy,
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Management-Client",
        Component: Dummy,
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Management-Client",
        Component: Dummy,
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
        Component: Dummy,
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Apotek",
        Component: Dummy,
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Apotek",
        Component: Dummy,
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
        Component: Dummy,
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Laboratorium",
        Component: Dummy,
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Laboratorium",
        Component: Dummy,
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

  const builder = (routes: RawWrapRoutePropsT[]): WrapRoutePropsT[] => {
    return routes.map(
      (x) =>
        ({
          ...x,
          permissions: parsed_permissions[x.module] ?? {
            can_create: false,
            can_delete: false,
            can_edit: false,
            can_view: false,
          },
          ...(x.childs ? { childs: builder(x.childs) } : {}),
        } as WrapRoutePropsT)
    );
  };

  return builder(routes);
};

export type {
  ComponentPropsT,
  ModuleT,
  PermissionT,
  RawWrapRoutePropsT,
  WrapRoutePropsT,
};
