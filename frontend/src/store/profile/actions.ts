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
  "auth/fetchUserInfo",
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
  "auth/fetchUserStats",
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
  "auth/fetchUserProjects",
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