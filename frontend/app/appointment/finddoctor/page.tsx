import FindDoctor from "@/components/FindDoctor";
import Loader from "@/components/Loader";
import NoAuthDisplay from "@/components/NoAuthDisplay";
import { Suspense } from "react";

 

export default function Home5(){

    return (

        <>
        <NoAuthDisplay>
            <Suspense fallback={<Loader />}>
                <FindDoctor />
            </Suspense>
        </NoAuthDisplay>
        </>
    )
}