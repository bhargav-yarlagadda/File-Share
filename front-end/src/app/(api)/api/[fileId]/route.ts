import { getFileMetaData } from "@/libs/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
    const { fileId } = await params; 

 

    if (!fileId) {
        return NextResponse.json({ message: "Please Provide fileId" }, { status: 400 });
    }

    const response = await getFileMetaData(fileId);

    if (!response.status) {
        return NextResponse.json({ message: "Unable to fetch the document" }, { status: 400 });
    }

    return NextResponse.json({ data: response.data }, { status: 200 });
}
