import { userData } from "@/types/common.type";
import { createSlice } from "@reduxjs/toolkit";
import { deleteCookie } from "cookies-next";
import { userSliceData } from "../interfaces/interfaces";

const initialState: userSliceData = {
  isLoggedIn: false,
  userData: null
};

export const userSlice = createSlice({
  name: "userSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoginData: (state, { payload }: { payload: userData }) => {
      // state.email
      state.userData = payload;
      state.isLoggedIn = true;
    },
    checkLoggedInServer: (state, { payload }) => {
      state.isLoggedIn = payload?.hasToken;
      state.userData = payload?.user;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      // cookie.remove("privy_token");
      // cookie.remove("user");

      deleteCookie("user", { path: "/" });
      deleteCookie(process.env.NEXT_APP_TOKEN_NAME!, { path: "/" });

      window.location.href = "/login";
    }
  },
  extraReducers: {}
});

export const { setLoginData, checkLoggedInServer, logout } = userSlice.actions;

export default userSlice.reducer;
