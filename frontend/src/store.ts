import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PermissionT } from "./routes";
import client from "./api";

export const slice = createSlice({
  name: "app",
  initialState: {
    isLoading: false,
    token: localStorage.getItem("token") as string | null,
    user: null as UserT | null,
    permissions: [] as PermissionT[],
  },
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    login: (
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) => {
      const run = async () => {
        state.isLoading = true;
        try {
          const login = await client.post<
            ApiResponseT<{ data: UserT; token: string }>
          >("/auth/login-user", action.payload);

          const check = await client.get<{
            user: UserT;
            role_permissions: PermissionT[];
            user_permissions: PermissionT[];
          }>("/check-token", {
            headers: { Authorization: `Bearer ${login.data.data.token}` },
          });

          if (login.data.data.token !== null)
            localStorage.setItem("token", login.data.data.token ?? "");
          state.user = check.data.user;
          state.permissions = [
            check.data.role_permissions,
            check.data.user_permissions,
          ].flat(1);
        } catch (error) {
          console.error(error);
        } finally {
          state.isLoading = false;
        }
      };

      run();
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<UserT | null>) => {
      state.user = action.payload;
    },
    setPermissions: (state, action: PayloadAction<PermissionT[]>) => {
      state.permissions = action.payload;
    },
  },
});

export const store = configureStore({ reducer: slice.reducer });
export type AppState = ReturnType<typeof store.getState>;
