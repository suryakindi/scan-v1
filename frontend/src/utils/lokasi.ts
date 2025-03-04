import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { api, ResponseT, XStatus } from "./api";

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

export type { ProvinceT, RegencieT, DistrictT, VillageT };

export const getProvinces = async () => {
  try {
    const response = await api.get<ResponseT<ProvinceT[]>>("/lokasi/provinces");
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("error get provinces");
    }
  }
};

export const getRegencies = async (province_id: number | string) => {
  try {
    const response = await api.get<ResponseT<RegencieT[]>>(
      "/lokasi/regencies",
      {
        params: { province_id },
      }
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("error get regencies");
    }
  }
};

export const getDistricts = async (regency_id: number | string) => {
  try {
    const response = await api.get<ResponseT<DistrictT[]>>(
      "/lokasi/districts",
      {
        params: { regency_id },
      }
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("error get districts");
    }
  }
};

export const getVillages = async (district_id: number | string) => {
  try {
    const response = await api.get<ResponseT<VillageT[]>>("/lokasi/villages", {
      params: { district_id },
    });
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("error get villages");
    }
  }
};

type UseLokasiReturn = [
  {
    provinces: ProvinceT[];
    regencies: RegencieT[];
    districts: DistrictT[];
    villages: VillageT[];
  },
  {
    getProvinces: () => Promise<void>;
    getRegencies: (province_id: number | string) => Promise<void>;
    getDistricts: (regency_id: number | string) => Promise<void>;
    getVillages: (district_id: number | string) => Promise<void>;
    status: XStatus;
  }
];

export const useLokasi = (): UseLokasiReturn => {
  const [provinces, setProvinces] = useState<ProvinceT[]>([]);
  const [regencies, setRegencies] = useState<RegencieT[]>([]);
  const [districts, setDistricts] = useState<DistrictT[]>([]);
  const [villages, setVillages] = useState<VillageT[]>([]);
  const [status, setStatus] = useState<XStatus>("idle");

  const _provinces = useCallback(async () => {
    try {
      setStatus("loading");
      setProvinces(await getProvinces());
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      throw error;
    }
  }, []);

  const _regencies = useCallback(async (province_id: number | string) => {
    try {
      setStatus("loading");
      setRegencies(await getRegencies(province_id));
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      throw error;
    }
  }, []);

  const _districts = useCallback(async (regency_id: number | string) => {
    try {
      setStatus("loading");
      setDistricts(await getDistricts(regency_id));
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      throw error;
    }
  }, []);

  const _villages = useCallback(async (district_id: number | string) => {
    try {
      setStatus("loading");
      setVillages(await getVillages(district_id));
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      throw error;
    }
  }, []);

  return [
    { provinces, regencies, districts, villages },
    {
      getProvinces: _provinces,
      getRegencies: _regencies,
      getDistricts: _districts,
      getVillages: _villages,
      status,
    },
  ];
};
