"use client";

import React, { useState } from "react";

const ShareViaUrl = () => {
  const [file, setFile] = useState<File | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="bg-[#22033d] w-full pb-12 overflow-y-hidden min-h-screen flex flex-col md:flex-row items-center justify-center pt-16 px-20">
      <div className="w-full mt-12 md:mt-0 md:w-1/2 flex flex-col items-start gap-6 p-6 bg-[#22033d] rounded-lg ">
        {/* Expiry Date Field */}
        <label className="text-white text-lg w-full">
          Expiry Date:
          <input
            type="datetime-local"
            className="mt-2 w-full px-4 py-2 rounded-md bg-[#3e52ac] text-white outline-none border border-gray-600 focus:border-cyan-500 transition-all"
          />
        </label>

        {/* Password Required Switch */}
        <div className="flex items-center gap-4 w-full">
          <span className="text-white text-lg">Encrypt File :</span>
          <div
            className={`w-12 h-6 flex items-center bg-black rounded-full p-1 cursor-pointer transition-all ${
              passwordRequired ? "bg-cyan-500" : ""
            }`}
            onClick={() => setPasswordRequired(!passwordRequired)}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${
                passwordRequired ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Password Field */}
        {passwordRequired && (
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md bg-[#22033d] text-white outline-none border border-gray-600 focus:border-cyan-500 transition-all"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {/* Generate URL Button */}
        <button className="w-full bg-green-500 hover:bg-green-600 cursor-pointer text-white px-6 py-2 rounded-md transition-all">
          Generate URL
        </button>
      </div>

      {/* Right Side - File Upload */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
        <label
          htmlFor="file"
          className="bg-cyan-500 px-6 py-3 flex items-center justify-center w-full md:w-2/3 h-[350px] border-2 border-white rounded-2xl text-white cursor-pointer"
        >
          {file ? (
            <p className="mt-3 text-white">{file.name}</p>
          ) : (
            <p className="mt-3 text-white w-[120px] text-center">
              Upload a File
            </p>
          )}
        </label>
        <input
          type="file"
          id="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ShareViaUrl;
