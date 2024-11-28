"use client";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { selectIsLoggedIn } from "@/Redux/LoginSlice";
import { useSelector} from "react-redux"

export function LoginButton() {
  const router = useRouter()
  const isLoggedIn = useSelector(selectIsLoggedIn) 
  return (
  !isLoggedIn && (
    <div className="fixed top-14 right-3 z-50 sm:top-2">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        onClick={() => router.push("authenticate/login")}
        className="bg-teal-600 text-white dark:text-white flex items-center"
      >
        <span className="flex items-center text-xs">Login <LogInIcon className=" ms-2" /></span>
      </HoverBorderGradient>
    </div>
  )
  )
}