"use client"
import "@/styles/globals.css";
import { LowerNavbar } from "@/components/LowerNavbar";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { Provider } from "react-redux";
import store from "@/Redux/Store";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const excludedRoutes = ['/404'];

  // Check if current route should be excluded
  const isExcluded = excludedRoutes.includes(pathname) || pathname.startsWith('/websockets/') || pathname.startsWith('/authenticate/');


  return (
    <html lang="en">
      <head>
        <title>Medico</title>
        <link rel="icon" href="/logo.ico" ></link>
      </head>
      <body className="bg-indigo-100">
        <Provider store={store}>
          {isExcluded ? children : (
            <>
              {children}
              <LowerNavbar />
              <Footer />
            </>
          )}
        </Provider>
      </body>
    </html>
  );
}
