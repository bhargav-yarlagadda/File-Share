'use server'

import { Query } from "appwrite";
import { database } from "./appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;

if (!DATABASE_ID || !COLLECTION_ID) {
  throw Error("missing environment variables.");
}

// Save File Metadata to Database
export const saveFileMetadata = async (
  fileId: string,
  fileUrl: string,
  uploadedBy: string,
  senderAddress: string,
  expiresAt: string,
  passwordRequired: boolean,
  isFileDownloaded: boolean = false,
  password?: string
) => {
  try {
    const response = await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      "unique()",
      {
        uploadedBy, // User ID of uploader
        expiresAt, // Expiry timestamp
        fileID: fileId, // Unique file ID
        createdAt: new Date().toISOString(), // Timestamp when uploaded
        password: password || "", // Optional password (hashed)
        passwordRequired, // Boolean: if password is needed
        fileURL: fileUrl, // Secure file URL
        isFileDownloaded, // Tracks if file has been downloaded
        senderAddress, // Email of sender/uploader
      }
    );
    return response;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
};

export const getFileMetaData = async (fileId: string) => {
  try {
    const data = await database.getDocument(DATABASE_ID, COLLECTION_ID, fileId);

    // ✅ If the file is valid, return its data
    return { status: true, data };
  } catch (error) {
    console.error("Delete Metadata Error:", error);
    return { message: "Error in fetching document", status: false };
  }
};

export const deleteFileMetadata = async (documentId: string) => {
  try {
    await database.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
    return true;
  } catch (error) {
    console.error("Delete Metadata Error:", error);
    return false;
  }
};
export const getDocumentId = async (fileId: string) => {
  try {
    // Query the database for a document where the 'fileID' field matches the provided fileId
    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("fileID", fileId)] // Query for the custom fileID field
    );

    // Check if any documents were found
    if (response.documents.length === 0) {
      return { message: "No document found with this fileId", status: false };
    }

    // Since fileIds are unique, there should only be one document
    const document = response.documents[0];

    // Return the document data and its document ID ($id)
    return {
      documentId: document.$id, // The Appwrite document ID
      data: document,           // The full document data
      status: true
    };
  } catch (error:any) {
    console.error("Error fetching document by fileId:", error?.message);
    return { message: "Error fetching document", status: false };
  }
};