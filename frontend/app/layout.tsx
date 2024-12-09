"use client"
import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "@/Redux/Store";
import ClientLayout from "./client-layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Medico</title>
        <link rel="icon" href="/logo.ico" />
      </head>
      <body className="bg-indigo-100">
        <Provider store={store}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Provider>
      </body>
    </html>
  );
}
