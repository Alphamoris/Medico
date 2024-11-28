import VideoConference from "@/components/WSpage";

export default async function Page({ params }: { params: { roomid: string } }) {
  return (
    <div>
      <VideoConference roomid={params.roomid} />
    </div>
  )
}
