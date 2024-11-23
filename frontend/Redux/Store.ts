import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./Slice";


const store = configureStore({
    reducer: {
        customer : customersReducer,
    },
});

export default store;