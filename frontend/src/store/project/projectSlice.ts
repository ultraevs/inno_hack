import { createSlice } from "@reduxjs/toolkit";
import { fetchProjectInfo } from "./actions";

interface IInitialState {
  tasks: ITask[];
  text_content: any;
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

const initialState: IInitialState = {
  tasks: [],
  text_content: null,
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
  },
});

export default projectSlice.reducer;
