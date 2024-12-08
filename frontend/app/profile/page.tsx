
import ProfileComponent from "@/components/Profile";
import NoAuthDisplay from "@/components/NoAuthDisplay";
import Loader from "@/components/Loader";
import { Suspense } from "react";


 

export default function Home1(){

    return (

        <>
        <NoAuthDisplay> 
            <Suspense fallback={<Loader />}>
                <ProfileComponent />
            </Suspense>
        </NoAuthDisplay>
        </>
    )
}