import { configureStore, createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "app",
  initialState: {},
  reducers: {},
});

export const store = configureStore({ reducer: slice.reducer });
