import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FileShare",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ClerkLoading>
            <div className="flex h-screen w-screen items-center justify-center bg-black/70 backdrop-blur-3xl  ">
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6 animate-bounce rounded-full bg-indigo-500 [animation-delay:0ms]"></span>
                <span className="h-6 w-6 animate-bounce rounded-full bg-indigo-500 [animation-delay:150ms]"></span>
                <span className="h-6 w-6 animate-bounce rounded-full bg-indigo-500 [animation-delay:300ms]"></span>
              </div>
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <>
            <Navbar/>
            {children}
            </>
            </ClerkLoaded>
        </ClerkProvider>
      </body>
    </html>
  );
}
