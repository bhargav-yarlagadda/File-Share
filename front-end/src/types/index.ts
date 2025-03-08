export interface FileMetaData {
    fileID: string
    fileURL: string
    uploadedBy: string
    senderAddress: string
    expiresAt: string // ISO string format (Datetime)
    createdAt?: string // Optional, auto-generated
    password?: string // Optional, only if passwordRequired is true
    passwordRequired: boolean
    isFileDownloaded: boolean
  }
  
export interface StorageUrlsType{
  fileId:string,
  docId:string
}