import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo } from "./actions";

interface IInitialState {
  info: {
    email: string;
    name: string;
  } | null;
}

const initialState: IInitialState = {
  info: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.info = action.payload;
    });
  },
});

export const {} = profileSlice.actions;

export default profileSlice.reducer;
