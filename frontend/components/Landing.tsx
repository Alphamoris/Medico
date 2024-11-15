import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";
import Link from "next/link";


export function Landing() {

  const words = `Transforming Healthcare with Compassionate Care, Cutting-Edge Technology, and 
       Personalized Solutions, All Designed to Empower You on Your Journey to Better Health and a Brighter Future.`;

  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[30rem] overflow-hidden ">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className=" text-white text-2xl mt-40 md:text-6xl sm:mt-0 font-bold text-center">
          <Link className="flex items-center" href="/">
            <Image
              alt="logo"
              className=" me-6 rounded-full border-4 border-white hover:scale-110 hover:shadow-lg transition-transform duration-900 ease-in-out animate-pulse"
              src="/logo.ico" // Consider using SVG for better scalability
              height={100}
              width={100}
            />
            <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400  to-blue-600 hover:underline hover:scale-110 transition-all duration-500 ease-out shadow-lg transform">
              Medico
            </span>

          </Link>
        </h2>
        <TextGenerateEffect words={words} />
        {/* <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Order now
          </button>
          <button className="px-4 py-2  text-white ">Watch trailer</button>
        </div> */}
      </Vortex>
    </div>
  );
}
