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
  "auth/loginUser",
  async (_params, thunkAPI) => {
    try {
      const response = await configApi.get("/users/info", {
        withCredentials: true,
      });

      return response.data as IFetchUserInfoResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  }
);

export const fetchMeetings = createAsyncThunk<IMeetingDetails[]>(
  "meetings/fetchMeetings",
  async (_, thunkAPI) => {
    try {
      const response = await configApi.get("/users/meetings", {
        withCredentials: true,
      });
      const meetings: IMeeting[] = response.data.meetings;

      // Получаем детали для каждого созвона
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
);