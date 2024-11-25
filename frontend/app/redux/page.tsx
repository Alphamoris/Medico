"use client";
import { useDispatch } from "react-redux";
import { setCustomers } from "@/Redux/Slice";
import { setIsLoggedIn } from "@/Redux/LoginSlice";
import { selectCustomers } from "@/Redux/Slice";
import { selectIsLoggedIn } from "@/Redux/LoginSlice";
import { useSelector } from "react-redux";
import VideoConference from "@/components/WSpage";

export default function ReduxPage() {
    const dispatch = useDispatch();
    const customers = useSelector(selectCustomers);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    console.log(customers);
    
    return (
        <div>
            {/* <h1>ReduxPage</h1>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => dispatch(setCustomers([{ id: 1, name: "John Doe" }, { id: 2, name: "This is a test" }] ))}>Set Customers</button> 
            <div>
                {customers.map((customer: any) => (
                    <div key={customer.id}>{customer.name}</div>
                ))}
            </div>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => dispatch(setIsLoggedIn(true))}>Log In</button> 
            <div>
                <h1>{isLoggedIn ? "Logged In" : "Logged Out"}</h1>
            </div> */}
            <VideoConference />
        </div>
    );
}
