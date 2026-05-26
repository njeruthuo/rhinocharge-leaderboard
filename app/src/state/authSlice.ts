import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || "",
    user: localStorage.getItem("user") || "",
  },
  reducers: {
    authenticateUser: (state, action) => {
      console.log(action.payload, "authentication information");

      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);

      const userData = JSON.stringify(action.payload.user);
      state.user = userData;
      localStorage.setItem("user", userData);
    },
    logoutUser: (state) => {
      state.token = "";
      state.user = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { authenticateUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
