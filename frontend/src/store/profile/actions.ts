import { configApi } from "@/api/configApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface IFetchUserInfoResponse {
  email: string;
  name: string;
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
  },
);
