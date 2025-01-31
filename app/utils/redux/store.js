import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/utils/redux/slice/userSlice";
export const makeStore = configureStore({
  reducer: {
    user: userReducer,
  },
});
