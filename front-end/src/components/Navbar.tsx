"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="flex w-full px-8  items-center justify-center  overflow-x-hidden absolute top-5">
      <nav className=" w-[1280px] rounded-b-3xl rounded-t-xl md:rounded-full flex justify-between items-center px-4 md:px-10 py-4 md:py-2 bg-white/10 backdrop-blur-lg border border-purple-500/50 shadow-lg shadow-purple-800/20 z-10">
        {/* Left - Logo */}
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
          <span className="text-pink-500">File</span>Share
        </h1>

        {/* Right - Auth Links */}
        {isSignedIn ? (
          <div className="flex items-center">
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-2 md:gap-6">
            <Link
              href="/sign-in"
              className="cursor-pointer border border-pink-500 text-pink-400 px-2  md:px-6 py-1 md:py-2 rounded-lg transition-all duration-300 hover:bg-pink-500 hover:text-white hover:shadow-pink-500/50"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="cursor-pointer bg-pink-500 text-white px-2  md:px-6 py-1 md:py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-pink-500/50 hover:-translate-y-1"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
