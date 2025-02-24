interface ProvinceT {
  id: number;
  name: string;
  cdfix: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface RegencieT {
  id: number;
  name: string;
  cdfix: string | null;
  province_id: number;
  created_at: string | null;
  updated_at: string | null;
}

interface DistrictT {
  id: number;
  name: string;
  cdfix: string | null;
  regency_id: number;
  created_at: string | null;
  updated_at: string | null;
}

interface VillageT {
  id: number;
  name: string;
  cdfix: string | null;
  district_id: number;
  created_at: string | null;
  updated_at: string | null;
}
