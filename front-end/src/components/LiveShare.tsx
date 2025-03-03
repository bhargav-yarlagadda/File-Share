'use client'

import React from 'react';
import Link from 'next/link';
const LiveShare = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-6 relative overflow-hidden">
      {/* Glowing Overlay */}
      {/* <div className="absolute inset-0 bg-opacity-20 backdrop-blur-lg"></div> */}

      {/* Header */}
      <div className="text-center max-w-2xl mt-20 md:mt-5 mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
          LiveShare - Instant, Secure, & Peer-to-Peer
        </h1>
        <p className="text-gray-300 mt-4 text-lg">
          Experience seamless file sharing with WebRTC. No servers, no storage—just real-time, encrypted peer-to-peer transfers.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        {/* Send Box */}
        <div className="relative w-full md:w-1/2 p-8 bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl m-4 text-center transition-all duration-300 hover:scale-105 hover:border-blue-500">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Send Files</h2>
          <p className="text-gray-300 mb-6">
            Select a file and generate a unique code. Share it with your friend, and they can instantly receive your file in real-time.
          </p>
          <Link 
          href={'/live-share/send'}
          className="px-6 py-3 bg-blue-500 cursor-pointer text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-500/50">
            Send File
          </Link>
        </div>

        {/* Receive Box */}
        <div className="relative w-full md:w-1/2 p-8 bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl m-4 text-center transition-all duration-300 hover:scale-105 hover:border-green-500">
          <h2 className="text-3xl font-bold text-green-400 mb-4">Receive Files</h2>
          <p className="text-gray-300 mb-6">
            Enter the unique code provided by the sender, and instantly receive your file via a secure WebRTC connection.
          </p>
          <Link href={'/live-share/receive'}  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-green-600 hover:shadow-green-500/50">
            Receive File
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-gray-400 text-sm">
        <p>🔒 100% Secure. | 🚀 Lightning Fast. | 🌎 No files saved in servers.</p>
      </div>
    </div>
  );
};

export default LiveShare;
