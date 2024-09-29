import { configApi } from "@/api/configApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

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


interface ICreateTextContent  {
  projectId: number;
  content: string,
  content_type: string,
  order_num: number
}

export const createTextContent = createAsyncThunk(
  "project/createTextContent",
  async (data: ICreateTextContent, thunkAPI) => {
    try {
      const response = await configApi.post(
        `projects/${data.projectId}/content`,
        { content: data.content,
          content_type: data.content_type,
          order_num: data.order_num
         },
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

interface IUpdateTextContent {
  blockId: number;
  changes: {
    content: string;
    content_type: string;
    order_num: number;
  };
}

export const updateTextContent = createAsyncThunk(
  "project/updateTextContent",
  async (data: IUpdateTextContent, thunkAPI) => {
    try {
      const response = await configApi.put(
        `projects/content/${data.blockId}`,
        data.changes,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

interface IDeleteTextContent {
  blockId: number;
}

export const deleteTextContent = createAsyncThunk(
  "project/deleteTextContent",
  async (data: IDeleteTextContent, thunkAPI) => {
    try {
      const response = await configApi.delete(
        `projects/content/${data.blockId}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);