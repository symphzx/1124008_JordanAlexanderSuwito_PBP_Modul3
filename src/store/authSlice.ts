import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo } from "../type";

export type AuthState = {
    userInfo?: UserInfo;
    isLoading: boolean;
};

const initialState: AuthState = {
    userInfo: undefined,
    isLoading: true,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo | undefined>) => {
            state.userInfo = action.payload;
        },
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
