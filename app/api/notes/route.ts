import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const readOnly = process.env.NODE_ENV === "production";

// READ: get all notes.
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ notes, readOnly });
}

// CREATE: add a note. Disabled on Vercel/production.
export async function POST(request: Request) {
  if (readOnly) {
    return NextResponse.json(
      { error: "Mode Vercel hanya-baca. Tambah catatan dilakukan secara lokal." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();

  if (!title) {
    return NextResponse.json(
      { error: "Judul catatan wajib diisi." },
      { status: 400 },
    );
  }

  const note = await prisma.note.create({
    data: { title, content },
  });

  return NextResponse.json(note, { status: 201 });
}
