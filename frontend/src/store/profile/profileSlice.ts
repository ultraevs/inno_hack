import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMeetings, fetchUserInfo } from "./actions";

interface IInitialState {
  info: {
    email: string;
    name: string;
  } | null;
  meetings: IMeetingDetails[];
}

interface IMeeting {
  created_by: string;
  id: number;
  meeting_date: string;
  zoom_link: string;
}

interface IMeetingDetails extends IMeeting {
  participants: string[];
}

const initialState: IInitialState = {
  info: null,
  meetings: [],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.info = action.payload;
    });
    builder.addCase(
      fetchMeetings.fulfilled,
      (state, action: PayloadAction<IMeetingDetails[]>) => {
        state.meetings = action.payload;
      }
    );
  },
});

export default profileSlice.reducer;
