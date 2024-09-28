import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllTasks } from "./acitons";

const initialState = {
    tasks: []
  };

export const ganttSlice = createSlice({
    name: "gantt",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllTasks.fulfilled, (state, action) => {
          state.tasks = action.payload;
        });
    },
  });
  
  export default ganttSlice.reducer;