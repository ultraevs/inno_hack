import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserInfo, fetchUserProjects, fetchUserStats, fetchMeetings } from "./actions";

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
  meetings: IMeetingDetails[];
}

interface IMeeting {
  created_by: string;
  id: number;
  meeting_date: string;
  zoom_link: string;
}

interface IMeetingDetails extends IMeeting {
  participants: string[];
}

const initialState: IInitialState = {
  info: null,
  stats: null,
  projects: [],
  meetings: []
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
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
      .addCase(
        fetchMeetings.fulfilled,
        (state, action: PayloadAction<IMeetingDetails[]>) => {
          state.meetings = action.payload;
        }
      );
  },
});

export default profileSlice.reducer;
