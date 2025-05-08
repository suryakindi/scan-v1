import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserObject } from "./global-types";

const { reducer, actions } = createSlice({
  name: "app",
  initialState: {
    user: null,
  } as {
    user: UserObject | null;
  },
  reducers: {
    setUser(state, action: PayloadAction<UserObject>) {
      state.user = action.payload;
    },
  },
});

const store = configureStore({ reducer });

export { store, actions };

export type AppState = ReturnType<typeof store.getState>;
