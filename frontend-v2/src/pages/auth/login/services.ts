import { api } from "../../../utils/api";
import { baseService } from "../../../utils/base-service";

export default {
  ...baseService,
  async login() {
    try {
      const response = await api.post("/");
      console.log(response);
    } catch (error) {
      console.error();
    }
  },
};
