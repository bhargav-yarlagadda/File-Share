"use server";
import { saveFileMetadata } from "@/libs/database";
import { FileMetaData } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "API" },
        { status: 200 })
}
    

export async function POST(request: Request) {
  try {
    const body: FileMetaData = await request.json();
    const {
      fileID,
      fileURL,
      uploadedBy,
      senderAddress,
      expiresAt,
      passwordRequired,
      isFileDownloaded,
      password,
    } = body;
    if (!fileID || !fileURL || !uploadedBy || !senderAddress || !expiresAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const response = await saveFileMetadata(
      fileID,
      fileURL,
      uploadedBy,
      senderAddress,
      expiresAt,
      passwordRequired,
      isFileDownloaded,
      password
    );
    if (!response) {
      return NextResponse.json(
        { error: "Failed to save metadata" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
