import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";


export function Landing() {

  const words = `Transforming Healthcare with Compassionate Care, Cutting-Edge Technology, and 
       Personalized Solutions, All Designed to Empower You on Your Journey to Better Health and a Brighter Future.`;

  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[30rem] overflow-hidden ">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Medico
        </h2>
        <TextGenerateEffect words={words} />
        {/* <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
        </p> */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Order now
          </button>
          <button className="px-4 py-2  text-white ">Watch trailer</button>
        </div>
      </Vortex>
    </div>
  );
}
