// actions.ts
import { configApi } from "@/api/configApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface IFetchUserInfoResponse {
  email: string;
  name: string;
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

export const fetchUserInfo = createAsyncThunk<IFetchUserInfoResponse, void>(
  "profile/fetchUserInfo",
  async (_params, thunkAPI) => {
    try {
      const response = await configApi.get("/users/info", {
        withCredentials: true,
      });

      return response.data as IFetchUserInfoResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  },
);

interface IFetchUserStatsResponse {
  done_tasks_count: number;
  total_projects_count: number;
}

export const fetchUserStats = createAsyncThunk<IFetchUserStatsResponse, void>(
  "profile/fetchUserStats",
  async (_params, thunkAPI) => {
    try {
      const response = await configApi.get("/users/stats", {
        withCredentials: true,
      });

      return response.data as IFetchUserStatsResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  },
);

export const fetchUserProjects = createAsyncThunk<any, void>(
  "profile/fetchUserProjects",
  async (_params, thunkAPI) => {
    try {
      const response = await configApi.get("/user/projects", {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  },
);

export const fetchUserInvitations = createAsyncThunk<any, void>(
  "profile/fetchUserInvitations",
  async (_params, thunkAPI) => {
    try {
      const response = await configApi.get("user/invitations", {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  },
);

export const fetchMeetings = createAsyncThunk<IMeetingDetails[]>(
  "profile/fetchMeetings",
  async (_, thunkAPI) => {
    try {
      const response = await configApi.get("/users/meetings", {
        withCredentials: true,
      });
      const meetings: IMeeting[] = response.data.meetings;

      const meetingsWithDetails = await Promise.all(
        meetings.map(async (meeting) => {
          const detailResponse = await configApi.get(`/meetings/${meeting.id}`, {
            withCredentials: true,
          });
          return detailResponse.data.meeting as IMeetingDetails;
        })
      );

      return meetingsWithDetails;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Ошибка при получении созвонов");
    }
  }
)
