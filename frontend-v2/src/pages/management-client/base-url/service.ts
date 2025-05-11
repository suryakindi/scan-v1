import { api, ResponseT } from "@/utils/api";
import { baseService } from "@/utils/base-service";
import { BaseURLObject, Token } from "@/utils/global-types";

type BaseURLPayload = { base_url: string; kdAplikasi: string };

export default {
  ...baseService,
  async getData(token: Token) {
    return await api.get<ResponseT<BaseURLObject[]>>(
      "/integerasi-sistem/get-base-url",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
  async addData(token: Token, data: BaseURLPayload) {
    return await api.post<ResponseT<BaseURLObject>>(
      "/integerasi-sistem/create-base-url",
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
  async editData(token: Token, id: BaseURLObject["id"], data: BaseURLPayload) {
    return await api.put(`/integerasi-sistem/edit-base-url/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  initBaseURLPayload(): BaseURLPayload {
    return { base_url: "", kdAplikasi: "" };
  },
};

export type { BaseURLPayload };
