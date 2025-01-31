import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  email: null,
  name: null,
  photoUrl: null,
  createdAt: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.photoUrl = action.payload.photoUrl;
      state.createdAt = action.payload.createdAt;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.name = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
