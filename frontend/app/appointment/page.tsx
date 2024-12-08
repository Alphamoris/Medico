import AppointmentComponent from "@/components/Appointment";
import NoAuthDisplay from "@/components/NoAuthDisplay";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default function Home3(){

    return (

        <>
        <NoAuthDisplay>
            <Suspense fallback={<Loader />}>
                <AppointmentComponent />
            </Suspense>
        </NoAuthDisplay>
        </>
    )
}