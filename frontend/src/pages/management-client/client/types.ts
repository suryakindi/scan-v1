import type { ResponseT } from "../../../utils/api";

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

type BaseClientPayload = {
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

type CreateClientPayload = BaseClientPayload;

type CreateClientResponse = ResponseT<
  BaseClientPayload & {
    id: number;
    updated_at: string;
    created_at: string;
  }
>;

type UpdateClientPayload = BaseClientPayload;

type UpdateClientResponse = ResponseT<
  BaseClientPayload & {
    id: number;
    updated_at: string;
    created_at: string;
  }
>;

export type {
  ClientT,
  CreateClientPayload,
  CreateClientResponse,
  UpdateClientPayload,
  UpdateClientResponse,
};
