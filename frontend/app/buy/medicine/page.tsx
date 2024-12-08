import BuyMedicine from "@/components/BuyMedicines";
import NoAuthDisplay from "@/components/NoAuthDisplay";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { Signup } from "@/components/Signup";

 

export default function Home1(){

    return (

        <>
        <NoAuthDisplay>
            <Suspense fallback={<Loader />}>
                <BuyMedicine />
            </Suspense>
        </NoAuthDisplay>
        </>
    )
}