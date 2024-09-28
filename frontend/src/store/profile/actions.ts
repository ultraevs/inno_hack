import { configApi } from "@/api/configApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface IResult {
  success: boolean;
  message?: string;
}

interface IFetchUserInfoResponse {
  email: string;
  name: string;
}

interface IMeeting {
  id: number;
  meetingDate: string;
  name: string;
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

      return response.data.projects;
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
  async (_params, thunkAPI) => {
    try {
      const response = await configApi.get("/users/meetings", {
        withCredentials: true,
      });
      const meetings: IMeeting[] = response.data.meetings;

      const meetingsWithDetails = await Promise.all(
        meetings.map(async (meeting) => {
          const detailResponse = await configApi.get(
            `/meetings/${meeting.id}`,
            {
              withCredentials: true,
            },
          );
          return detailResponse.data.meeting as IMeetingDetails;
        }),
      );

      return meetingsWithDetails;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

interface ICreateProjectProps {
  projectName: string;
  users: { username: string; role: string }[];
  linkToFigma: string;
}

export const createProject = createAsyncThunk<IResult, ICreateProjectProps>(
  "profile/createProject",
  async (data: ICreateProjectProps, thunkAPI) => {
    try {
      await configApi.post("/project_create", data, {
        withCredentials: true,
      });

      thunkAPI.dispatch(fetchUserProjects());

      return { success: true };
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  },
);

interface ICreateMeetingProps {
  projectName: string;
  meetingName: string;
  meetingDate: string;
  zoomLink: string;
}

export const createMeeting = createAsyncThunk<IResult, ICreateMeetingProps>(
  "profile/createMeeting",
  async (data: ICreateMeetingProps, thunkAPI) => {
    try {
      await configApi.post("/meetings/", data, {
        withCredentials: true,
      });

      return { success: true };
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  },
);
