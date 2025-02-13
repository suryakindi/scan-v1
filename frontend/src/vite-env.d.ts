/// <reference types="vite/client" />

interface ApiResponseT<T = unknown> {
  status: string;
  message: string;
  detailError: string | null;
  data: T;
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
}
