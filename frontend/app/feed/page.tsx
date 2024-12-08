
import Feed from "@/components/Feed";
import NoAuthDisplay from "@/components/NoAuthDisplay";
import Loader from "@/components/Loader";
import { Suspense } from "react";

 

export default function Home1(){

    return (

        <>
        <NoAuthDisplay>
            <Suspense fallback={<Loader />}>
                <Feed />
            </Suspense>
        </NoAuthDisplay>
        </>
    )
}