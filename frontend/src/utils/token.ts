import { api } from "./api";

type ResponseTokenT = {
  user: UserT;
  role_permissions: PermissionT;
  user_permissions: PermissionT;
};

export const checkToken = async (): Promise<ResponseTokenT | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get<ResponseT<ResponseTokenT>>("/check-token", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
