import { configApi } from "@/api/configApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";

interface IResult {
  success: boolean;
  message?: string;
}

interface ILoginUserProps {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<IResult, ILoginUserProps>(
  "auth/loginUser",
  async (data: ILoginUserProps, thunkAPI) => {
    try {
      const response = await configApi.post("/login", data);

      const token = response.data.token;

      if (token) {
        setCookie("Authtoken", token);
        localStorage.setItem("isAuth", JSON.stringify(true));
      }

      return { success: true };
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  },
);

interface IRegisterUserProps {
  email: string;
  name: string;
  password: string;
}

export const registerUser = createAsyncThunk<IResult, IRegisterUserProps>(
  "auth/registerUser",
  async (data: IRegisterUserProps, thunkAPI) => {
    try {
      const response = await configApi.post("/user_create", data);

      const token = response.data.token;

      if (token) {
        setCookie("Authtoken", token);
        localStorage.setItem("isAuth", JSON.stringify(true));
      }

      return { success: true };
    } catch (error) {
      return thunkAPI.rejectWithValue({ success: false, message: error });
    }
  },
);
