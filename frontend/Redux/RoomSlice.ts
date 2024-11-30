import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
    name: "room",
    initialState: {
        rooms: {
            joinCode: "",
            password: "",
        },
    },
    reducers: {
        setRooms: (state, action) => {
            state.rooms.joinCode = action.payload.joinCode;
            state.rooms.password = action.payload.password;
        },
    },
});

export const { setRooms } = roomSlice.actions;
export const selectRooms = (state: any) => state.room.rooms;
export default roomSlice.reducer;
