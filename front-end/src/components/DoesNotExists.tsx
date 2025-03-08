'use client'

import React from "react";
import Link from "next/link";
const DoesNotExist = () => {


  return (
    <div className="flex  items-center justify-center p-6">
      <div className="max-w-lg rounded-2xl flex-col  bg-gray-800 p-8 shadow-[0_0_20px_rgba(255,0,0,0.7)] border border-red-500 text-center relative overflow-hidden">
        {/* Glitch Effect */}
        <h1 className="text-4xl font-bold text-red-500 tracking-widest glitch">
          FILE NOT FOUND
        </h1>
        <p className="mt-4 mb-8 text-gray-300 text-lg">
          The file you are looking for has either been{" "}
          <span className="font-semibold text-white">extracted</span> or{" "}
          <span className="font-semibold text-white">deleted</span> due to Time To Live (TTL).
        </p>

        <Link
            href='/'
          className=" px-6 z-20  py-3 cursor-pointer text-lg font-semibold text-white bg-red-500 rounded-full shadow-lg transition-all duration-300 hover:bg-red-600 hover:shadow-red-500/50"
        >
          Return to home page
        </Link>

     
      </div>

    </div>
  );
};

export default DoesNotExist;
