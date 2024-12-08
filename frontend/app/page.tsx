import { LoginButton } from "@/components/LoginButton";
import Dive from "@/components/Dive";
import EmergencyButton from "@/components/Ambulance";
import { UpperNavbar } from "@/components/UpperNavbar";
import Health from "@/components/HealthcareLanding";
import ChatRoomButton from "@/components/ChatRoomButton";


export default function Home() {
  return (
    <>
      <UpperNavbar />
      <LoginButton />
      <Health />
      <Dive />
      <ChatRoomButton />
      <EmergencyButton />
    </>
  );
}
