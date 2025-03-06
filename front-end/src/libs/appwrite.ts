import { Client, Storage, Databases } from "appwrite";

const client = new Client();
console.log(
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID, "is id",
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_URL, "is URL"
);

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_URL || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    throw new Error("Missing Appwrite environment variables");
}

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_URL)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const database = new Databases(client);
export const storage = new Storage(client);
export default client;
