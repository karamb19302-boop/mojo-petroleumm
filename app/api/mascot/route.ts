import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const projectRoot = process.cwd();
  const files = await fs.readdir(projectRoot);
  const mascotFile = files.find((file) => file.toLowerCase().startsWith("screenshot") && file.toLowerCase().endsWith(".png"));
  if (!mascotFile) {
    return NextResponse.json({ error: "Mascot asset not found" }, { status: 404 });
  }
  const filePath = path.join(projectRoot, mascotFile);
  const fileBuffer = await fs.readFile(filePath);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
