import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./Slice";
import loginReducer from "./LoginSlice";
import JWTSlice from "./jwtSlice";
import roomReducer from "./RoomSlice";


const store = configureStore({
    reducer: {
        customers: customersReducer,
        login: loginReducer,
        JWTTooken: JWTSlice,
        room: roomReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
