import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // data: {meetings}
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
  }
});

export const {} = profileSlice.actions;

export default profileSlice.reducer;
