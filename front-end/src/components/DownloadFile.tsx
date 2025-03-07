"use client";

import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { FileMetaData } from "@/types";
import { AiOutlineFile, AiOutlineDownload } from "react-icons/ai";
import Loader from "./Loader";

const DownloadFile = ({ fileData }: { fileData: {data:FileMetaData} }) => {
    const data = fileData.data
    
    const [enteredPassword, setEnteredPassword] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState("");
    const handlePasswordSubmit = async () => {
        if (!data.password) {
            setError("No password found for this file.");
            return;
        }

        const isMatch = await bcrypt.compare(enteredPassword, data.password);
        if (isMatch) {
            setIsVerified(true);
            setError("");
        } else {
            setError("Incorrect password. Please try again.");
        }
    };

    const handleDownload = async () => {
        try {
            // Fetch the file as a blob
            const response = await fetch(data.fileURL);
            const blob = await response.blob();
    
            // Create a blob URL
            const blobUrl = URL.createObjectURL(blob);
    
            // Create a temporary anchor element
            const link = document.createElement("a");
            link.href = blobUrl;
    
            // Extract filename from URL or use a fallback
            const fileName = "Fileshare"
            link.download = fileName; // Suggest a filename for download
    
            // Append to DOM and trigger click
            document.body.appendChild(link);
            link.click();
    
            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading file:", error);
            setError("Failed to initiate download. Please try again.");
        }
    };
    
    return (
        <div className="w-full max-w-lg mx-auto bg-white text-black shadow-md rounded-lg p-5">
            {!fileData && <Loader/>}
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <AiOutlineFile /> File Details
            </h2>

            {data.passwordRequired && !isVerified ? (
                <div className="flex flex-col gap-2">
                    <label className="text-gray-600 font-medium">Enter Password:</label>
                    <input
                        type="password"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={handlePasswordSubmit}
                        className="bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Verify Password
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <p className="text-gray-700"><strong>Uploaded By:</strong> {data.uploadedBy || "unkown"}</p>
                    <p className="text-gray-700"><strong>Sender Address:</strong> {data.senderAddress}</p>
                    <p className="text-gray-700"><strong>Expires At:</strong> {new Date(data.expiresAt).toLocaleString()}</p>

                    <iframe
                        src={data.fileURL}
                        className="w-full h-64  border rounded-md"
                        title="File Preview"
                    />

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition w-full justify-center"
                    >
                        <AiOutlineDownload /> Download File
                    </button>
                </div>
            )}
        </div>
    );
};

export default DownloadFile;
