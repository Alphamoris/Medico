import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./Slice";
import loginReducer from "./LoginSlice";

const store = configureStore({
    reducer: {
        customers: customersReducer,
        login: loginReducer,
    },
});

export default store;