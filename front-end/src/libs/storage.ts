
import { ID } from "appwrite";
import { storage } from "./appwrite";


const Storage_Bucket_Id = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID
if(!Storage_Bucket_Id){
    throw Error("missing storage id")
}
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID   

export const uploadFile = async (file:File)=>{
    try {
        console.log("fn started")
        try {
            
            const response = await storage.createFile(Storage_Bucket_Id,ID.unique(),file)
         return response.$id
        } catch (error:any) {
            console.log(error?.message,"is the error")
            return null
        }
        console.log("fn ended")
        
        return null 
        // return response.$id // returns file id.
    } catch (error:any) {

        console.log(error?.messsage)
        return null
    }
}
export const getFileUrl = async (fileId: string) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/${Storage_Bucket_Id}/files/${fileId}/view?project=${projectId}`
  }

export const deleteFile = async (fileId:string)=>{
    try{
        await storage.deleteFile(Storage_Bucket_Id,fileId)
        return true
    }catch(error){
        console.log("error in deleting file.")
        return false
    }
}
  