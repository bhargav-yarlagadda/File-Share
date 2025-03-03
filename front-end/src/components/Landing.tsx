"use client";

import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#15002e] to-[#29004c] p-6">
      <div className="relative w-full max-w-7xl">
        <div className="relative flex flex-col md:flex-row items-center rounded-3xl border border-purple-600/50 bg-white/10 backdrop-blur-lg p-10 justify-between shadow-2xl shadow-purple-800/50 mt-20">
          {/* Left Side - Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-5xl font-extrabold text-white leading-tight">
              <span className="text-pink-500">File Transfer</span> Simplified
            </h2>
            <p className="mt-4 text-gray-300 text-lg">
              Secure, instant, and hassle-free. Send files via LiveShare or
              generate a shareable link effortlessly.
            </p>
            <div className="mt-6 flex gap-4 justify-center md:justify-start">
              <button className="relative overflow-hidden bg-pink-500 text-white mb-4 px-2 md:px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-pink-500/50 hover:-translate-y-1 text-sm md:text-base">
                LiveShare
                <span className="absolute inset-0 bg-pink-400/20 blur-md -z-10"></span>
              </button>
              <button className="relative overflow-hidden border border-pink-500 text-pink-400 mb-4 px-2 md:px-6 py-3 rounded-lg transition-all duration-300 hover:bg-pink-500 hover:text-white hover:shadow-pink-500/50 text-sm md:text-base">
                Share Via URL
                <span className="absolute inset-0 bg-pink-400/10 blur-md -z-10"></span>
              </button>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative group">
              <Image
                src={"/Landing.webp"}
                alt="File Transfer Illustration"
                height={350}
                width={500}
                className="rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
