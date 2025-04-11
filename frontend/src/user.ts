import { redirect, type LoaderFunctionArgs } from "react-router";
import { api, ResponseT } from "./utils/api";
import { ClientT } from "./pages/management-client/client/types";

type ModuleT =
  | "Registrasi"
  | "Pasien"
  | "Integrasi-Tools"
  | "Management-Client"
  | "Master-Data";

type RolesT =
  | "Administrator"
  | "Dokter"
  | "Perawat"
  | "Rekam Medis"
  | "Apotek"
  | "Analis Laboratorium"
  | "Dinas Kesehatan"
  | "Nutritionist"
  | "Kader"
  | "Kasir"
  | "Dinas Catatan Sipil"
  | "Pendaftaran"
  | "Bidan";

interface PermissionT {
  module: ModuleT;
  can_view: boolean;
  can_edit: boolean;
  can_create: boolean;
  can_delete: boolean;
}

interface UserRoleT {
  id: number;
  name: RolesT;
  created_at: string;
  updated_at: string;
}

interface UserT {
  id: number;
  name: string;
  username: string;
  role_id: number;
  email: string;
  notelp: string;
  nik: string;
  nip: string | null;
  sip: string | null;
  kode_bpjs: string | null;
  ihs_id: string | null;
  is_active: boolean;
  cdfix: number;
  created_at: string;
  updated_at: string;
  roles: UserRoleT;
}

interface LoaderT {
  permission: PermissionT | (Omit<PermissionT, "module"> & { module: null });
  client: ClientT;
  user: UserT;
  token: string;
}

export const userLoader = async (_: LoaderFunctionArgs, module?: ModuleT) => {
  try {
    const token = localStorage.getItem("token") ?? "";
    const user = await api.get<
      ResponseT<{
        user: UserT;
        role_permissions: PermissionT;
        user_permissions: PermissionT;
        client: ClientT;
      }>
    >("/check-token", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const permission = [
      user.data.data.role_permissions,
      user.data.data.user_permissions,
    ]
      .flat(1)
      .reduce(
        (acc, curr) => ({
          ...acc,
          [curr.module]: {
            module: curr.module,
            can_view: acc[curr.module]?.can_view || curr.can_view || false,
            can_edit: acc[curr.module]?.can_edit || curr.can_edit || false,
            can_create:
              acc[curr.module]?.can_create || curr.can_create || false,
            can_delete:
              acc[curr.module]?.can_delete || curr.can_delete || false,
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

    return {
      permission,
      token,
      user: user.data.data.user,
      client: user.data.data.client,
    } as LoaderT;
  } catch (error) {
    console.error(error);
    return redirect("/login");
  }
};

export type { ModuleT, RolesT, PermissionT, UserRoleT, UserT, LoaderT };
