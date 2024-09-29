import { configApi } from "@/api/configApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllTasks = createAsyncThunk(
    "gantt/fetchAllTasks",
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