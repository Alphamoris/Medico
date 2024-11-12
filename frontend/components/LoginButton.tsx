"use client";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function HoverBorderGradientDemo() {
    const router = useRouter()
  return (
    <div className="fixed top-14 right-3 z-50 sm:top-2">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        onClick={() => router.push("authenticate/login")}
        className="bg-black text-white dark:text-white flex items-center"
      >
        <span className="flex items-center text-xs">Login <LogInIcon className=" ms-2"/></span>
      </HoverBorderGradient>
    </div>
  );
}