import { api, ResponseT } from "@/utils/api";
import { baseService } from "@/utils/base-service";
import { BaseURLObject, Token } from "@/utils/global-types";

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
};
