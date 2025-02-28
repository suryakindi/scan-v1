interface ClientT {
  id: number;
  is_active: boolean;
  connect_bpjs: boolean;
  nama_client: string;
  notelp: string;
  email: string;
  website: string | null;
  alamat: string;
  kelurahan_id: number;
  kecamatan_id: number;
  kabupaten_id: number;
  provinsi_id: number;
  koordinat1: string;
  koordinat2: string;
  created_at: string;
  updated_at: string;
}

type CreateClientPropsT = {
  nama_client: string;
  notelp: string;
  email: string;
  website: string;
  alamat: string;
  kelurahan_id: string;
  kecamatan_id: string;
  kabupaten_id: string;
  provinsi_id: string;
  koordinat1: string;
  koordinat2: string;
  is_active?: boolean;
};

type UpdateClientPropsT = CreateClientPropsT & { id: string };
