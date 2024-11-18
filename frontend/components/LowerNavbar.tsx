import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { FaUserDoctor } from "react-icons/fa6";
import { GiArtificialHive, GiMedicines } from "react-icons/gi";
import { CalendarDaysIcon, CircleUserRoundIcon, HistoryIcon, NewspaperIcon } from "lucide-react";

export function LowerNavbar() {
  
  const links = [
    {
      title: "Appointments",
      icon: (
        <CalendarDaysIcon color="teal" className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/appointment",
    },

    {
      title: "Feed",
      icon: (
        <NewspaperIcon color="teal" className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/feed",
    },
    {
      title: "Find Doctors",
      icon: (
        <FaUserDoctor color="teal" className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/appointment/finddoctor",
    },
    {
      title: "Hi! I'm Dive AI",
      icon: (
        <div className="relative inline-block">
        <GiArtificialHive size={40} className="text-blue-500 rounded-full border border-black " />
        
      </div>
      ),
      href: "/",
    },
    {
      title: "History",
      icon: (
        <HistoryIcon color="teal" className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      
      href: "#",
    },

    {
      title: "Buy Medicine",
      icon: (
        <GiMedicines color="teal" className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/buy/medicine",
    },
    {
      title: "Profile",
      icon: (
        <CircleUserRoundIcon color="teal" className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-40 ">
      <FloatingDock 
        items={links}
      />
    </div>
  );
}
