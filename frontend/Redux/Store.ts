import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./Slice";
import loginReducer from "./LoginSlice";
import JWTSlice from "./jwtSlice";
const store = configureStore({
    reducer: {
        customers: customersReducer,
        login: loginReducer,
        JWTTooken: JWTSlice,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
