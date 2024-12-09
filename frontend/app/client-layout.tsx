"use client"

import { LowerNavbar } from "@/components/LowerNavbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludedRoutes = ['/404'];
  const isExcluded = excludedRoutes.includes(pathname) || 
    pathname.startsWith('/websockets/') || 
    pathname.startsWith('/authenticate/');

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <LowerNavbar />
      <Footer />
    </>
  );
}
