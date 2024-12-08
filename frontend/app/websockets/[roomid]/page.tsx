import VideoConference from "@/components/WSpage";
import NoAuthDisplay from "@/components/NoAuthDisplay";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default async function Page() {
  return (
    <NoAuthDisplay>
      <Suspense fallback={<Loader />}>
        <VideoConference />
      </Suspense>
    </NoAuthDisplay>
  )
}
