import { configApi } from "@/api/configApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProjectInfo = createAsyncThunk(
  "project/fetchProjectInfo",
  async (id: number, thunkAPI) => {
    try {
      const response = await configApi.get(`projects/${id}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

interface ICreateTaskProps {
  projectId: number;
  title: string;
}

export const createTask = createAsyncThunk(
  "project/createTask",
  async (data: ICreateTaskProps, thunkAPI) => {
    try {
      const response = await configApi.post(
        `projects/${data.projectId}/tasks`,
        { title: data.title },
        {
          withCredentials: true,
        },
      );

      thunkAPI.dispatch(fetchProjectInfo(data.projectId));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

interface IUpdateTaskProps {
  projectId: number;
  taskId: number;
  changes: any;
}

export const updateTask = createAsyncThunk(
  "project/createTask",
  async (data: IUpdateTaskProps, thunkAPI) => {
    try {
      const response = await configApi.put(
        `projects/${data.projectId}/tasks/${data.taskId}`,
        data.changes,
        {
          withCredentials: true,
        },
      );

      thunkAPI.dispatch(fetchProjectInfo(data.projectId));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

interface IDeleteTaskProps {
  projectId: number;
  taskId: number;
}

export const deleteTask = createAsyncThunk(
  "project/createTask",
  async (data: IDeleteTaskProps, thunkAPI) => {
    try {
      const response = await configApi.delete(
        `projects/${data.projectId}/tasks/${data.taskId}`,
        {
          withCredentials: true,
        },
      );

      thunkAPI.dispatch(fetchProjectInfo(data.projectId));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export interface IGenerateTaskProps {
  description: string;
  tasks: string[];
  project_id: number;
  Authtoken: string;
}

export const generateTask = createAsyncThunk(
  "project/generateTask",
  async (data: IGenerateTaskProps, thunkAPI) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/generate_tasks",
        data,
      );

      thunkAPI.dispatch(fetchProjectInfo(data.project_id));

    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const fetchAllUsers = createAsyncThunk("project/fetchAllUsers", async (_params, thunkAPI) => {
  try {
    const response = await configApi.get("/users/names")

    return response.data.user_names;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
})