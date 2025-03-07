"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FileMetaData } from "@/types";
import { getFileMetaDataFromDb } from "@/utils/fileHandlers";
import Loader from "@/components/Loader";
import DownloadFile from "./DownloadFile";
import { ErrorMessage } from "./ShowErrorMessage";

const ShowDownload = () => {
  const { fileId } = useParams() as { fileId: string };
  console.log(fileId,"is the fileId")
  const [data, setData] = useState<FileMetaData | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!fileId) {
        setMessage("File ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getFileMetaDataFromDb(fileId);
        if (response.status) {
          setData(response.data);
          setMessage("");
        } else {
          setMessage(response.message || "Failed to fetch file metadata.");
        }
      } catch (error) {
        setMessage("An error occurred while fetching data.");
        console.error("Error fetching metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fileId]);

  return (
    <div className="w-screen min-h-screen pt-24 px-8">
      {isLoading && (
        <div className=" absolute inset-0 z-10">
          <Loader />
        </div>
      )}

      {!isLoading && message && <ErrorMessage message={message} />}

      {!isLoading && data && <DownloadFile fileData={data} />}
    </div>
  );
};

export default ShowDownload;
