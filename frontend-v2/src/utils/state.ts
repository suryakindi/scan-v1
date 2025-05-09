import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthObject, Token } from "./global-types";

const { reducer, actions } = createSlice({
  name: "app",
  initialState: {
    auth: null,
    token: null,
  } as {
    auth: AuthObject | null;
    token: Token;
  },
  reducers: {
    setAuth(state, action: PayloadAction<AuthObject | null>) {
      state.auth = action.payload;
    },
    setToken(state, action: PayloadAction<Token>) {
      state.token = action.payload;
    },
  },
});

const store = configureStore({ reducer });

export { store, actions };

export type AppState = ReturnType<typeof store.getState>;
