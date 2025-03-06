import { database } from "./appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID 

if(!DATABASE_ID || !COLLECTION_ID){
    throw Error("missing environment variables.")
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
        'unique()',
        {
          uploadedBy, // User ID of uploader
          expiresAt, // Expiry timestamp
          fileID: fileId, // Unique file ID
          createdAt: new Date().toISOString(), // Timestamp when uploaded
          password: password || '', // Optional password (hashed)
          passwordRequired, // Boolean: if password is needed
          fileURL: fileUrl, // Secure file URL
          isFileDownloaded, // Tracks if file has been downloaded
          senderAddress, // Email of sender/uploader
        }
      )
      return response
    } catch (error) {
      console.error('Database Error:', error)
      return null
    }
  }

  export const deleteFileMetadata = async (documentId: string) => {
    try {
      await database.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId)
      return true
    } catch (error) {
      console.error('Delete Metadata Error:', error)
      return false
    }
  }
