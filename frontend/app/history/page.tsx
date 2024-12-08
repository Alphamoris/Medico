import MedicoContactPage from "@/components/ContactUs";
import MedicoHistoryDashboard from "@/components/History";
import Loader from "@/components/Loader";
import NoAuthDisplay from "@/components/NoAuthDisplay";
import { Suspense } from "react";

export default function Home1(){

    return (

        <>  
        <NoAuthDisplay>
            <Suspense fallback={<Loader />}>
                <MedicoHistoryDashboard />
            </Suspense>
        </NoAuthDisplay>
        </>
    )
}