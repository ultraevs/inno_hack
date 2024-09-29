import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import profileSlice from "./profile/profileSlice";
import projectSlice from "./project/projectSlice";
import chatSlice from "./chat/chatSlice";
import ganttSlice from "./gantt/ganttSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      profile: profileSlice,
      project: projectSlice,
      chat: chatSlice,
      gantt: ganttSlice
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
