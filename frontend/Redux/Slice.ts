import { createSlice } from "@reduxjs/toolkit";

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
export const selectCustomers = (state: any) => state.customers.customers;
export default customersSlice.reducer;
