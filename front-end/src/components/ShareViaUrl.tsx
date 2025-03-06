"use client";

import { getFileUrl, uploadFile } from "@/libs/storage";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { saveFileMetaDataToDb } from "@/utils/fileHandlers";
import Loader from "./Loader";

const ShareViaUrl = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const { user, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  const handleFileSubmit = async () => {
    if (!file || !isSignedIn || !expiryDate) {
      setStatusMessage(
        "Please select a file, sign in, and set an expiry date."
      );
      return;
    }

    setIsLoading(true);
    setStatusMessage("Uploading file...");
    setCopied(false);
    setFileUrl("");
    try {
      const fileId = await uploadFile(file);
      if (!fileId) throw new Error("File upload failed.");

      const fileURL = await getFileUrl(fileId);
      if (!fileURL) throw new Error("Failed to get file URL.");

      const uploadedBy = user.fullName || user.firstName || "Unknown User";
      const senderAddress = user.primaryEmailAddress?.emailAddress || "";

      const hashedPassword = password.trim()
        ? await hashPassword(password.trim())
        : undefined;

      const success = await saveFileMetaDataToDb({
        fileID: fileId,
        fileURL,
        uploadedBy,
        senderAddress,
        expiresAt: new Date(expiryDate).toISOString(),
        passwordRequired: !!password,
        isFileDownloaded: false,
        password: hashedPassword,
      });

      if (success) {
        setFileUrl(`${window.location.origin}/${fileId}`);
        setStatusMessage("File uploaded successfully!");
      } else {
        throw new Error("Failed to save file metadata.");
      }
    } catch (error: any) {
      setStatusMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#22033d] w-full min-h-screen flex flex-col md:flex-row items-center justify-center pt-20 p-6 md:p-20">
      {isLoading && (
        <div className="absolute inset-0 z-10 w-screen h-screen flex items-center justify-center bg-opacity-50">
          <Loader />
        </div>
      )}

      <div className="w-full md:w-1/2 flex flex-col gap-6 p-6 bg-[#22033d] rounded-lg">
        <label className="text-white text-lg w-full">
          Expiry Date:
          <input
            type="datetime-local"
            className="mt-2 w-full px-4 py-2 rounded-md bg-[#3e52ac] text-white border border-gray-600 focus:border-cyan-500 
              sm:text-sm sm:px-3 sm:py-1.5 md:text-base lg:text-lg"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </label>

        <input
          type="password"
          className="w-full px-4 py-2 rounded-md bg-[#22033d] text-white border border-gray-600 focus:border-cyan-500"
          placeholder="Enter Password (Optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleFileSubmit}
          disabled={isLoading}
          className={`w-full px-6 py-2 rounded-md text-white ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isLoading ? "Uploading..." : "Generate URL"}
        </button>

        {statusMessage && (
          <p
            className={`mt-2 text-sm ${
              statusMessage.includes("successfully")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {statusMessage}
          </p>
        )}

        {fileUrl && (
          <div
            className="text-white cursor-pointer mt-4 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition relative group"
            onClick={() => {
              navigator.clipboard.writeText(fileUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <p className="text-sm">Click to copy:</p>
            <p className="font-semibold text-cyan-400">{fileUrl}</p>

            {copied && (
              <span className="absolute w-full text-center md:w-xs top-12 left-1/2 transform -translate-x-1/2 border-2 border-cyan-600 bg-sky-700 text-white text-xs px-2 py-1 rounded-md shadow-md">
                Copied!
              </span>
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
        <label
          htmlFor="file"
          className="bg-cyan-500 px-6 py-3 flex items-center justify-center w-full md:w-2/3 h-[350px] border-2 border-white rounded-2xl text-white cursor-pointer"
        >
          {file ? (
            <p>{file.name}</p>
          ) : (
            <p className="text-center">Upload a File</p>
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
