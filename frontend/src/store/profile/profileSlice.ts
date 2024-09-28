// profileSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMeetings } from "./actions";

interface IMeeting {
  created_by: string;
  id: number;
  meeting_date: string;
  zoom_link: string;
}

interface IMeetingDetails extends IMeeting {
  participants: string[];
}

interface ProfileState {
  meetings: IMeetingDetails[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  meetings: [],
  loading: false,
  error: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action: PayloadAction<IMeetingDetails[]>) => {
        state.loading = false;
        state.meetings = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
