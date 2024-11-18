"use client"
import localFont from "next/font/local";
import "@/styles/globals.css";


import { UpperNavbar } from "@/components/UpperNavbar";
import { LowerNavbar } from "@/components/LowerNavbar";
import { LoginButton } from "@/components/LoginButton";
import { usePathname } from "next/navigation";
import Dive from "@/components/Dive";
import EmergencyButton from "@/components/Ambulance";
import Footer from "@/components/Footer";




  export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define routes to exclude from layout
    const excludedRoutes = ['/authenticate/login', '/authenticate/signup', '/404'];

    // Check if current route should be excluded
    const isExcluded = excludedRoutes.includes(pathname);

    // Conditional rendering based on route
    if (isExcluded) {
        return (
            <html lang="en">
                <body>{children}</body>
            </html>
        );
    }
  return (
    <html lang="en">
      <head>
        <title>Medico</title>
        <link rel="icon" href="/logo.ico"></link>
      </head>
      <body
        className={`antialiased bg-black `}>
        <LoginButton />
        {children}
        <LowerNavbar />
        {/* <Footer /> */}
      </body>
    </html>
  );
}
