import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo, fetchUserInvitations, fetchUserProjects, fetchUserStats } from "./actions";

interface IInitialState {
  info: {
    email: string;
    name: string;
  } | null;
  stats: {
    done_tasks_count: number;
    total_projects_count: number;
  } | null;
  projects: any[];
  invitations: any[]
}

const initialState: IInitialState = {
  info: null,
  stats: null,
  projects: [],
  invitations: [],
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
      })
      .addCase(fetchUserInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload === null ? [] : action.payload;
      });
  },
});

export const {} = profileSlice.actions;

export default profileSlice.reducer;
