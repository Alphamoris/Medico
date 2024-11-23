import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    customers: [],
};

const customersSlice = createSlice({
    name: "customers",
    initialState: {
        customers: [],
    },
    reducers: {
        setCustomers: (state, action) => {
            state.customers = action.payload;
        },
    },
});

export const { setCustomers } = customersSlice.actions;
export default customersSlice.reducer;