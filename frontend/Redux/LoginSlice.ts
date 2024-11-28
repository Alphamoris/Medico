import { createSlice } from "@reduxjs/toolkit";

const getInitialLoginState = (): boolean => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
        return true;
    } else {
        localStorage.setItem("isLoggedIn", "false");
        return false;
    }
}

const LoginSlice = createSlice({
    name: "login",
    initialState: {
        isLoggedIn: getInitialLoginState(),
    },
    reducers: {
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
            localStorage.setItem("isLoggedIn", action.payload);
        },
    },
});

export const { setIsLoggedIn } = LoginSlice.actions;
export const selectIsLoggedIn = (state: any) => state.login.isLoggedIn; // Added selector for accessing isLoggedIn
export default LoginSlice.reducer;