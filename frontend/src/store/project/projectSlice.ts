import { createSlice } from "@reduxjs/toolkit";
import { fetchProjectInfo, createTextContent, updateTextContent, deleteTextContent, fetchAllUsers } from "./actions";

interface IInitialState {
  tasks: ITask[];
  text_content: any;
  users: string[];
}

export interface ITask {
  assignee_name: string;
  deadline: string;
  description: string;
  duration: string;
  end_time: string;
  id: number;
  start_time: string;
  status: string;
  title: string;
}

export interface ITextContent {
  content: string;
  content_type: string;
  id: number;
  order_num: number;
}

const initialState: IInitialState = {
  tasks: [],
  text_content: [],
  users: [],
};

export const projectSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjectInfo.fulfilled, (state, action) => {
      state.tasks = action.payload.tasks !== null ? action.payload.tasks : [];
      state.text_content = action.payload.text_content;
    });
    builder.addCase(createTextContent.fulfilled, (state, action) => {
      state.text_content.push(action.payload);
    });
    builder.addCase(updateTextContent.fulfilled, (state, action) => {
      const index = state.text_content.findIndex(
        (content: any) => content.id === action.payload.id
      );
      if (index !== -1) {
        state.text_content[index] = action.payload;
      }
    });
    builder.addCase(deleteTextContent.fulfilled, (state, action) => {
      state.text_content = state.text_content.filter(
        (content: any) => content.id !== action.meta.arg.blockId
      );
    })
    .addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
  },
});

export default projectSlice.reducer;
