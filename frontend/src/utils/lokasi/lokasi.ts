import { isAxiosError } from "axios";
import { api } from "../api";
import { useCallback, useState } from "react";

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

export const getRegencies = async (province_id: number) => {
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

export const getDistricts = async (regency_id: number) => {
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

export const getVillages = async (district_id: number) => {
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

type StatusT = "idle" | "loading" | "success" | "error";

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
    status: StatusT;
  }
];

export const useLokasi = (): UseLokasiReturn => {
  const [provinces, setProvinces] = useState<ProvinceT[]>([]);
  const [regencies, setRegencies] = useState<RegencieT[]>([]);
  const [districts, setDistricts] = useState<DistrictT[]>([]);
  const [villages, setVillages] = useState<VillageT[]>([]);
  const [status, setStatus] = useState<StatusT>("idle");

  const fetchData = async <T>(
    endpoint: string,
    setData: React.Dispatch<React.SetStateAction<T[]>>,
    params?: object
  ) => {
    setStatus("loading");
    try {
      const response = await api.get<ResponseT<T[]>>(endpoint, { params });
      if (response.data.data) {
        setData(response.data.data);
        setStatus("success");
      }
    } catch (error) {
      setStatus("error");
      if (isAxiosError(error)) {
        throw new Error(error.message);
      }
      throw new Error(`Error fetching ${endpoint}`);
    }
  };

  const getProvinces = useCallback(
    () => fetchData<ProvinceT>("/lokasi/provinces", setProvinces),
    []
  );
  const getRegencies = useCallback(
    (province_id: number | string) =>
      fetchData<RegencieT>("/lokasi/regencies", setRegencies, { province_id }),
    []
  );
  const getDistricts = useCallback(
    (regency_id: number | string) =>
      fetchData<DistrictT>("/lokasi/districts", setDistricts, { regency_id }),
    []
  );
  const getVillages = useCallback(
    (district_id: number | string) =>
      fetchData<VillageT>("/lokasi/villages", setVillages, { district_id }),
    []
  );

  return [
    { provinces, regencies, districts, villages },
    { getProvinces, getRegencies, getDistricts, getVillages, status },
  ];
};
