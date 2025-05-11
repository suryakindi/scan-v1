import { api } from "@/utils/api";
import { baseService } from "@/utils/base-service";
import { Token } from "@/utils/global-types";

export default {
  ...baseService,
  async getData(token: Token) {
    return await api.get("/pasien/get-pasien", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
