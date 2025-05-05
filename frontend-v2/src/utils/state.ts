import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = "User" | null;

const { reducer, actions } = createSlice({
  name: "app",
  initialState: {
    user: null,
  } as {
    user: User;
  },
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

const store = configureStore({ reducer });

export { store, actions };
