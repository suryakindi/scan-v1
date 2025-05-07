import { redirect } from "react-router";
import { api, ResponseT } from "../../../utils/api";
import { baseService } from "../../../utils/base-service";
import type { AuthObject, Role } from "../../../utils/global-types";

type LoginPayload = { username: string; password: string };
type LoginResponse = {
  data: {
    id: number;
    name: string;
    role: Role;
  };
  token: string;
};

export default {
  ...baseService,
  async loader() {
    try {
      const response = await api.get<ResponseT<AuthObject>>("/check-token");
      if (response.data.data.user) {
        return redirect("/");
      }
    } catch (error) {
      console.error(error);
    }
  },
  async login(data: LoginPayload) {
    try {
      const response = await api.post<ResponseT<LoginResponse>>(
        "/auth/login-user",
        data
      );

      if (response.data.data) {
        localStorage.setItem("token", response.data.data.token);
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
    }
  },
};

export type { LoginPayload };
