import { isAxiosError } from "axios";
import { api } from "../api";

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
