// /components/ui/card-hover-effect.tsx
"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

export const HoverEffect = ({ 
  items, 
  className 
}: { 
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="relative h-full w-full space-y-4 p-6 rounded-2xl bg-gradient-to-b from-white/50 to-white/20 border border-white/20 shadow-sm backdrop-blur-sm transition duration-300 group-hover:border-white/50">
            {hoveredIndex === idx && (
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-teal-500/0 rounded-2xl blur-lg" />
            )}
            <div className="relative">
              <h3 className="font-bold text-xl text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-700">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};