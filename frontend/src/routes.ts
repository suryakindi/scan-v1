import type { RouteProps } from "react-router";

export type WrapRoutePropsT = RouteProps & {
  name: string;
  module: "Integrasi-Tools" | "Management-Client" | "Registrasi" | "Basic";
  childs?: WrapRoutePropsT[];
};

export const routes: WrapRoutePropsT[] = [
  {
    path: "pasien",
    name: "Pasien",
    module: "Basic",
    childs: [
      {
        path: "registrasi-pasien",
        name: "Pendaftaran Pasien",
        module: "Registrasi",
      },
      {
        path: "list-pasien",
        name: "List Pasien",
        module: "Registrasi",
      },
    ],
  },
  {
    path: "master",
    name: "Master Data",
    module: "Basic",
    childs: [
      { path: "ruangan", name: "Master Ruangan", module: "Management-Client" },
      {
        path: "asal-rujukan",
        name: "Master Asal Rujukan",
        module: "Management-Client",
      },
      {
        path: "departemen",
        name: "Master Departemen",
        module: "Management-Client",
      },
    ],
  },
];
