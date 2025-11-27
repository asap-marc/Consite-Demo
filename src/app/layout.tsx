import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consite Time Tracking – Sage plug-in",
  description: "Time card, equipment, and material tracking for construction sites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} font-sans antialiased flex flex-col min-h-screen bg-gray-100`}
      >
        <header className="p-4 flex-shrink-0 flex justify-between items-center bg-neutral-50 border-b border-neutral-200 shadow-sm">
          {/* Left side */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Consite Construction
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <span className="font-normal text-neutral-800">aleph</span>
                <span className="text-xs text-neutral-500">{" { science | growth }"}</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Sage plug-in
            </span>
          </div>
        </header>
        <AppProvider>
          <Navbar />
          <main className="flex-grow container mx-auto p-4">{children}</main>
        </AppProvider>
        <footer className="p-4 text-center text-xs text-neutral-500 flex-shrink-0">
          <p>© 2025 Aleph — available for licensing</p>
        </footer>
      </body>
    </html>
  );
}
