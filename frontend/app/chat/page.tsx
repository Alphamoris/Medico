import ChatRoom from "@/components/ChatRoom";
import NoAuthDisplay from "@/components/NoAuthDisplay";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default function Chat(){
    return (
        <>
        <NoAuthDisplay>
            <Suspense fallback={<Loader />}>
                <ChatRoom />
            </Suspense>
        </NoAuthDisplay>
        </>
    )
}