import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";


import { UpperNavbar } from "@/components/UpperNavbar";
import { LowerNavbar } from "@/components/LowerNavbar";
import { HoverBorderGradientDemo } from "@/components/LoginButton";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Medico</title>
        <link rel="icon" href="/logo.ico"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black ` }>
        <UpperNavbar />
        <HoverBorderGradientDemo />
        {children}
        <LowerNavbar />
      </body>
    </html>
  );
}
