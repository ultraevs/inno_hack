import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserInfo,
  fetchUserInvitations,
  fetchUserProjects,
  fetchUserStats,
  fetchMeetings,
} from "./actions";

interface IInitialState {
  info: {
    email: string;
    name: string;
  } | null;
  stats: {
    done_tasks_count: number;
    total_projects_count: number;
  } | null;
  invitations: IInvite[];
  projects: IProject[];
  meetings: IMeeting[];
}

export interface IProject {
  title: ReactNode;
  created_at: string;
  description: string | null;
  figma: string;
  id: number;
  name: string;
  owner_name: string;
  updated_at: string;
}

export interface IInvite {
  id: number;
  project_id: number;
  project_name: string;
  invitee_name: string;
  inviter_name: string;
  status: string;
  created_at: string;
  role: string;
}

export interface IMeeting {
  id: number;
  meetingDate: string;
  name: string;
  zoom_link: string;
}

interface IMeetingDetails extends IMeeting {
  participants: string[];
}

const initialState: IInitialState = {
  info: null,
  stats: null,
  projects: [],
  invitations: [],
  meetings: [],
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
      .addCase(fetchUserInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload === null ? [] : action.payload;
      })
      .addCase(
        fetchMeetings.fulfilled,
        (state, action: PayloadAction<IMeetingDetails[]>) => {
          state.meetings = action.payload;
        },
      );
  },
});

export default profileSlice.reducer;
