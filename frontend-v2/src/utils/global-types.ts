export type Role =
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

export type RoleObject = {
  id: number;
  name: Role;
  created_at: string | null;
  updated_at: string | null;
};

export type UserObject = {
  id: number;
  name: string;
  username: string;
  role_id: number;
  email: string;
  notelp: string | null;
  nik: string | null;
  nip: string | null;
  sip: string | null;
  kode_bpjs: string | null;
  ihs_id: string | null;
  is_active: boolean;
  cdfix: number;
  created_at: string;
  updated_at: string;
};

export type Module =
  | "Registrasi"
  | "Pasien"
  | "Integrasi-Tools"
  | "Management-Client"
  | "Master-Data"
  | "Layanan";

export type PermissionObject = {
  module: Module;
  can_view: boolean;
  can_edit: boolean;
  can_create: boolean;
  can_delete: boolean;
};

export type ClientObject = {
  id: number;
  is_active: boolean;
  connect_bpjs: boolean;
  nama_client: string;
  notelp: string;
  email: string;
  website: string | null;
  alamat: string | null;
  kelurahan_id: number;
  kecamatan_id: number;
  kabupaten_id: number;
  provinsi_id: number;
  koordinat1: string | null;
  koordinat2: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AuthObject = {
  user: UserObject;
  client: ClientObject;
  role_permissions: PermissionObject[];
  user_permissions: PermissionObject[];
  role: RoleObject;
};

export type Token = string | null;

export type BaseURLObject = {
  base_url: string;
  kdAplikasi: string;
  updated_at: string;
  created_at: string;
  id: number;
};

export type XHRStatus = "idle" | "success" | "error" | "loading";

export type PaginateLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Paginate<T = []> = {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginateLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  data: T;
};

export type ProvinceObject = {
  id: number;
  name: string;
  cdfix: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type RegencieObject = {
  id: number;
  name: string;
  cdfix: string | null;
  province_id: number;
  created_at: string | null;
  updated_at: string | null;
};

export type DistrictObject = {
  id: number;
  name: string;
  cdfix: string | null;
  regency_id: number;
  created_at: string | null;
  updated_at: string | null;
};

export type VillageObject = {
  id: number;
  name: string;
  cdfix: string | null;
  district_id: number;
  created_at: string | null;
  updated_at: string | null;
};

export type Agama =
  | "Islam"
  | "Kristen"
  | "Katolik"
  | "Hindu"
  | "Buddha"
  | "Konghucu"
  | "Aliran Lain"
  | "Ateis"
  | "Tidak Diketahui";

export type Pendidikan =
  | "SD"
  | "SMP"
  | "SMA"
  | "Diploma"
  | "S1"
  | "S2"
  | "S3"
  | "Tidak Diketahui"
  | "Tidak/Belum Sekolah";

export type Pekerjaan =
  | "Pelajar/Mahasiswa"
  | "Belum Bekerja"
  | "CPNS"
  | "PNS"
  | "Perangkat Desa"
  | "Pegawai/Karyawan BUMN"
  | "Pegawai/Karyawan BUMD"
  | "TNI AD"
  | "TNI AL"
  | "TNI AU"
  | "POLRI"
  | "Guru/Dosen"
  | "Dokter"
  | "Bidan"
  | "Perawat"
  | "Apoteker"
  | "Tenaga Medis Lain"
  | "Pegawai Swasta"
  | "Pegawai/Karyawan"
  | "Wiraswasta"
  | "Wirausaha"
  | "Pedagang"
  | "Petani"
  | "Nelayan"
  | "Buruh"
  | "Pekerja Sektor Informal"
  | "Migran"
  | "Purnawirawan"
  | "Pensiunan"
  | "Ibu Rumah Tangga"
  | "Tokoh Agama"
  | "Lain-Lain";

export type Perkawinan = "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati";

export type GolonganDarah = "A" | "B" | "AB" | "O";

export type JenisKelamin = "Laki Laki" | "Perempuan";

export type PasienObject = {
  id: number;
  is_active: boolean;
  nama: string;
  norm: string;
  no_bpjs: string;
  ihs_number: null | string;
  nik: string;
  tempatlahir: string;
  tanggal_lahir: string;
  agama: string;
  pendidikan_terakhir: string;
  pekerjaan: string;
  notelp: string;
  nama_bapak: string;
  nama_ibu: string;
  status_perkawinan: string;
  nama_pasangan: string;
  golongan_darah: string;
  id_alamat_pasien: 1;
  cdfix: string;
  created_at: string;
  updated_at: string;
  alamat_pasien: {
    id: number;
    is_active: boolean;
    id_pasien: number;
    alamat: string;
    rt: string;
    rw: string;
    id_kelurahan: string;
    id_kecamatan: string;
    id_kabupaten: string;
    id_provinsi: string;
    cdfix: number;
    created_at: string;
    updated_at: string;
  };
};
