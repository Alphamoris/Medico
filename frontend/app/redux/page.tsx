"use client";
import { useDispatch } from "react-redux";
import { setCustomers } from "@/Redux/Slice";
import { Provider } from "react-redux";
import store from "@/Redux/Store";
import { useSelector } from "react-redux";


export default function ReduxPage() {
    const dispatch = useDispatch();
    const customers = useSelector((state: any) => state.customer.customers);
    return (
        <Provider store={store}>
            <div>
                <h1>ReduxPage</h1>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => dispatch(setCustomers([{ id: 1, name: "John Doe" }, { id: 2, name: "This is a test" }] ))}>Set Customers</button> 
            <div>
                {customers.map((customer: any) => (
                    <div key={customer.id}>{customer.name}</div>
                ))}
            </div>
            </div>
        </Provider>
    );
}
