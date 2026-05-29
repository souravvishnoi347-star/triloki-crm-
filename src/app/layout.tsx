import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Triloki Group - Invoice Generator",
  description: "Professional Invoice Solutions for Triloki Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-100 text-slate-900 min-h-screen`}>
        <Sidebar />
        <main className="lg:pl-72 flex-1 flex flex-col min-h-screen pt-16 lg:pt-0">
          <div className="flex-1 w-full mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
