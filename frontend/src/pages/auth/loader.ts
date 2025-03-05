import { redirect } from "react-router";
import { PermissionT, UserT } from "../../user";
import { api, ResponseT } from "../../utils/api";

export const loginLoader = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get<
      ResponseT<{
        user: UserT;
        role_permissions: PermissionT;
        user_permissions: PermissionT;
      }>
    >("/check-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.data) return redirect("/");
  } catch (error) {
    console.error(error);
  }
};
