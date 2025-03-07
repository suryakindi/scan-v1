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
  alamat: {
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

type CreatePasienPayload = BasePasienPayload;

export type { CreatePasienPayload };
