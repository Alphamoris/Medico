import VideoConference from "@/components/WSpage";

 export default function Page({ params }: { params: { roomid: string } }) {
    return <div>Hello {params.roomid}
   
    </div>
  }
