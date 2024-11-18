import { LoginButton } from "@/components/LoginButton";
import { Landing } from "@/components/Landing";
import { Signup } from "@/components/Signup";
import Image from "next/image";
import Login from "@/components/Login";
import DoctorShowcase from "@/components/FindDoctor";
import Loader from "@/components/Loader";

import Loading from '@/components/Loader';
import MedicineStore from "@/components/BuyMedicines";
import Dive from "@/components/Dive";
import EmergencyButton from "@/components/Ambulance";
import { UpperNavbar } from "@/components/UpperNavbar";
import Health from "@/components/HealthcareLanding";


export default function Home() {
  return (
    <>
     <UpperNavbar />
      <Health />
      <Dive />
      <EmergencyButton />
      {/* <Dashboard /> */}
      {/* <DoctorShowcase /> */}
    </>
  );
}
