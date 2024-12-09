"use client";
import React, { useEffect, useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { selectIsLoggedIn } from "@/Redux/LoginSlice";
import { useSelector} from "react-redux"

export function LoginButton() {
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return !isLoggedIn ? (
    <div className="fixed top-14 right-3 z-50 sm:top-2">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        onClick={() => router.push("authenticate/login")}
        className="bg-teal-600 text-white p-2 dark:text-white flex items-center"
      >
        <span className="flex items-center text-sm font-semibold ">Login <LogInIcon className="ms-2" /></span>
      </HoverBorderGradient>
    </div>
  ) : null;
}