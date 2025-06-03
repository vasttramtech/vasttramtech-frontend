import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name : "",
  email: "",
  token: "",
  authenticated: false,
  designation:"Unauthenticated",
  id : null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.authenticated = true;
      state.designation = action.payload.designation;
      state.id = action.payload.id;
    },
    logout: (state) => {
      state.name = "";
      state.email = "";
      state.token = "";
      state.authenticated = false;
      state.designation = "Unauthenticated";
      state.id = null
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
