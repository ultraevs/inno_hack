import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import profileSlice from "./profile/profileSlice";
import projectSlice from "./project/projectSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      profile: profileSlice,
      project: projectSlice
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
