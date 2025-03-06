import {Client,Storage,Databases} from "appwrite"
const client = new Client()

if(process.env.APPWRITE_PROJECT_URL && process.env.APPWRITE_PROJECT_ID){
    client.setEndpoint(process.env.APPWRITE_PROJECT_URL).setProject(process.env.APPWRITE_PROJECT_ID)    
}else{
    throw Error("Missing Cloud URI")
}
export const database = new Databases(client)
export const storage = new Storage(client) 
export default client
