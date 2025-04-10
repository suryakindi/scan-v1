import {
  Agama,
  GolonganDarah,
  Pekerjaan,
  Pendidikan,
  Perkawinan,
} from "../../../utils/enums";

interface BasePasienPayload {
  norm: string | "is_auto";
  nama: string;
  no_bpjs: string;
  nik: string;
  tempatlahir: string;
  tanggal_lahir: string;
  agama: Agama;
  pendidikan_terakhir: Pendidikan;
  pekerjaan: Pekerjaan;
  notelp: string;
  nama_bapak: string;
  nama_ibu: string;
  status_perkawinan: Perkawinan;
  nama_pasangan: string;
  golongan_darah: GolonganDarah;
  cdfix: string;
  alamat_pasien: {
    alamat: string;
    rt: string;
    rw: string;
    id_kelurahan: string;
    id_kecamatan: string;
    id_kabupaten: string;
    id_provinsi: string;
    cdfix: string;
  };
  [key: string]: unknown;
}

type PasienT = {
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

type CreatePasienPayload = BasePasienPayload;

type RuanganT = {
  id: number;
  nama_ruangan: string;
  id_departemen: number;
  is_active: boolean;
  cdfix: string;
  kodeexternal: string;
  created_at: string;
  updated_at: string;
  nama_departemen: string;
};

type JenisKunjunganT = {
  id: number;
  jenis_kunjungan: string;
  kode_bpjs: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type JaminanT = {
  id: number;
  penjamin: string;
  is_active: boolean;
  cdfix: string;
  kodeexternal: string;
  created_at: string;
  updated_at: string;
};

type TkpT = {
  id: number;
  nama_tkp: string;
  is_active: boolean;
  cdfix: string;
  kodeexternal: string;
  created_at: string;
  updated_at: string;
};

export type {
  CreatePasienPayload,
  PasienT,
  RuanganT,
  JenisKunjunganT,
  JaminanT,
  TkpT,
};
