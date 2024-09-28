import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo, fetchUserProjects, fetchUserStats } from "./actions";

interface IInitialState {
  info: {
    email: string;
    name: string;
  } | null;
  stats: {
    done_tasks_count: number;
    total_projects_count: number;
  } | null;
  projects: any[] | null;
}

const initialState: IInitialState = {
  info: null,
  stats: null,
  projects: [],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.info = action.payload;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.projects = action.payload === null ? [] : action.payload;
      });
  },
});

export const {} = profileSlice.actions;

export default profileSlice.reducer;
