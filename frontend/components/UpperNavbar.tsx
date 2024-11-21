"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { IoIosBody } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { TbFriends } from "react-icons/tb";
import { PiInfinityDuotone } from "react-icons/pi";
import Link from "next/link";
import Image from "next/image";

export function UpperNavbar() {
  return (
    <div className="relative w-full flex items-center justify-center ">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-0 w-85 md:w-96 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
      {/* <Link className="flex items-center" href="/">
            <Image
              alt="logo"
              className="  md:me-0 me-1  rounded-full border-4 border-white hover:scale-110 hover:shadow-lg transition-transform duration-900 ease-in-out animate-pulse"
              src="/logo.ico" // Consider using SVG for better scalability
              height={32}
              width={32}
            />
            <span className="text-1md me-2 md:text-3md font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400  to-blue-600 hover:underline hover:scale-110 transition-all duration-500 ease-out transform">
              Medico
            </span>

          </Link> */}
        <Link href={"/"} className="flex items-center md:me-2 me-5">
          <Image className="me-1 rounded-full border border-black transition-transform duration-900 ease-in-out animate-pulse" src={"/logo.ico"} height={30} width={30} alt="logo"></Image>
          <span className="text-1md md:text-3md font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400  to-blue-600 hover:underline hover:scale-110 transition-all duration-500 ease-out transform">
            Medico
          </span>
        </Link>
        <MenuItem setActive={setActive} active={active} item="XtraCare">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/team">
              <div className="flex items-center"><IoIosStar color="gold" />
                <p className="ms-1">Medico's Star User</p>
              </div>
            </HoveredLink>
            <HoveredLink href="/team">
              <div className="flex items-center"><TbFriends color="teal" />
                <p className="ms-1">Whole Family Insurance</p>
              </div>
            </HoveredLink>
            <HoveredLink href="/team">
              <div className="flex items-center"><PiInfinityDuotone color="teal" />
                <p className="ms-1">Long Term Insurance</p>
              </div>
            </HoveredLink>
            <HoveredLink href="/team">
              <div className="flex items-center"><IoIosBody color="teal" />
                <p className="ms-1">Full Body Checkup</p>
              </div>
            </HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="  text-sm md:me-0 md:p-4 md:grid md:grid-cols-2 gap-10 me-24">
            <ProductItem
              title="Instant Ambulance"
              href="/"
              src="/ambulance.jpg"
              description="Instant Booking and you don't need to wait for the doctor, the doctor waits for you"
            />
            <ProductItem
              title="AI Support"
              href="/"
              src="/ai.jpg"
              description="Our Dive AI is mainly trailored for healthcare sector and makes life and health easier to maintain"
            />
            <ProductItem
              title="Easy Appointments"
              href="/appointment"
              src="/appointment.jpg"
              description="Schedule your appiontments with doctors way more easily with Medico"
            />
            <ProductItem
              title="Medications"
              href="/buy/medicine"
              src="/medication.jpg"
              description="We deliver medicines and our qualified services at your doorstep"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Help">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/interface-design">Medi Act1991</HoveredLink>
            <HoveredLink href="/seo">Our Policies</HoveredLink>
            <HoveredLink href="/branding">Contact Us</HoveredLink>
            <HoveredLink href="/web-dev">Others</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
