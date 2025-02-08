import { createSlice } from "@reduxjs/toolkit";


const getInitialJWTToken = (): string => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if (token) {
            return token;
        } else {
            localStorage.setItem("token", "");
            return "";
        }
    }
    return "";  // Default empty token for server-side rendering
}

const JWTSlice = createSlice({
    name: "JWTTooken",
    initialState: {
        token : getInitialJWTToken(),
    },
    reducers: {
        setJWTToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
    },
});

export const { setJWTToken } = JWTSlice.actions;
export const selectJWTToken = (state: any) => state.JWTTooken.token;
export default JWTSlice.reducer;
