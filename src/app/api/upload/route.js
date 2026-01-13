import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getAuthSession } from "@/utils/auth";

export const POST = async (req) => {
  const session = await getAuthSession();
  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }),
      { status: 401 }
    );
  }

  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file || typeof file === "string") {
      return new NextResponse(
        JSON.stringify({ message: "No file uploaded" }),
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || "";
    const fileName = `${Date.now()}-${randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;
    return new NextResponse(JSON.stringify({ url }), { status: 200 });
  } catch (err) {
    console.error("Upload error", err);
    return new NextResponse(
      JSON.stringify({ message: "Failed to upload file" }),
      { status: 500 }
    );
  }
};
