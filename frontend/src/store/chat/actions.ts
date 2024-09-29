import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IMessage } from "./chatSlice";

interface ISendMessageProps {
  user_text: string;
  Authtoken: string;
}

export const sendMessage = createAsyncThunk<IMessage, ISendMessageProps>(
  "chat/sendMessage",
  async (data: ISendMessageProps, thunkAPI) => {
    try {
      const response = await axios.post("https://task.shmyaks.ru/ai", data, {
        withCredentials: true,
      });

      const result = response.data.data as IMessage;

      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

interface ISendAnswerProps {
  secret: string;
  answer: boolean;
  Authtoken: string;
}

export const sendAnswer = createAsyncThunk<IMessage, ISendAnswerProps>(
  "chat/sendAnswer",
  async (data: ISendAnswerProps, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://task.shmyaks.ru/user_answer",
        data,
        {
          withCredentials: true,
        },
      );

      const result = response.data.data as IMessage;

      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
