"use client"
import React, { memo } from 'react';
import Image from 'next/image';

const  Loader = memo(() => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-4">
        {/* Fast spinning medical cross */}
        <div className="w-16 h-16 relative animate-spin">
          <div className="absolute w-4 h-16 bg-teal-500 left-1/2 -ml-2 rounded-full" />
          <div className="absolute w-16 h-4 bg-teal-500 top-1/2 -mt-2 rounded-full" />
        </div>

        {/* Pulse ring */}
        <div className="absolute -inset-2 border-4 border-teal-200 rounded-full animate-ping" />

        {/* Simple loading text */}
        <div className="text-teal-700 font-medium mt-4">
          Loading...
        </div>

        {/* Small medical icons */}
        <div className="absolute -inset-8 flex items-center justify-around opacity-30">
          <div className="w-4 h-4 border-2 border-teal-500 rounded-full" />
          <div className="w-4 h-4 border-2 border-teal-500 rotate-45" />
          <div className="w-4 h-4 border-2 border-teal-500 rounded-full" />
        </div>
      </div>
    </div>
  );
});

Loader.displayName = 'Loader';

export default Loader;