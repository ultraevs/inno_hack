import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth/authSlice'
import profileReducer from "./profile/profileSlice"; // Путь может отличаться


export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authSlice,
        profile: profileReducer,

    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
