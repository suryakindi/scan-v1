// export {};

interface ResponseT<T = unknown> {
  status: string;
  message: string;
  detailError: string | null;
  data: T;
}

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
interface LoaderMakeT {
  module?: ModuleT;
}

interface LoaderT {
  permission: PermissionT | (Omit<PermissionT, "module"> & { module: null });
  user: UserT;
  token: string;
}
