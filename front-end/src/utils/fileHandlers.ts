import axios from "axios";

export const saveFileMetaDataToDb = async ({
  fileID,
  fileURL,
  uploadedBy,
  senderAddress,
  expiresAt,
  passwordRequired,
  isFileDownloaded,
  password,
}: {
  fileID: string;
  fileURL: string;
  uploadedBy: string;
  senderAddress: string;
  expiresAt: string;
  passwordRequired: boolean;
  isFileDownloaded: boolean;
  password?: string;
}) => {
  try {
    const response = await axios.post("http://localhost:3000/api/upload", {
      fileID,
      fileURL,
      uploadedBy,
      senderAddress,
      expiresAt,
      passwordRequired,
      isFileDownloaded,
      password,
    });

    console.log("File saved successfully:", response.data);
    return true; 
  } catch (error: any) {
    console.error("Error saving file to DB:", error.response?.data || error.message);
    return false

  }
};

