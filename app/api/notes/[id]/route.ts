import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const readOnly = process.env.NODE_ENV === "production";

// UPDATE: edit a note. Disabled on Vercel/production.
export async function PUT(request: Request, { params }: RouteContext) {
  if (readOnly) {
    return NextResponse.json(
      { error: "Mode Vercel hanya-baca. Edit catatan dilakukan secara lokal." },
      { status: 403 },
    );
  }

  const { id } = await params;
  const noteId = Number(id);
  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();

  if (!Number.isInteger(noteId) || noteId < 1 || !title) {
    return NextResponse.json(
      { error: "ID atau judul catatan tidak valid." },
      { status: 400 },
    );
  }

  const existingNote = await prisma.note.findUnique({ where: { id: noteId } });
  if (!existingNote) {
    return NextResponse.json(
      { error: "Catatan tidak ditemukan." },
      { status: 404 },
    );
  }

  const note = await prisma.note.update({
    where: { id: noteId },
    data: { title, content },
  });

  return NextResponse.json(note);
}

// DELETE: remove a note. Disabled on Vercel/production.
export async function DELETE(_request: Request, { params }: RouteContext) {
  if (readOnly) {
    return NextResponse.json(
      { error: "Mode Vercel hanya-baca. Hapus catatan dilakukan secara lokal." },
      { status: 403 },
    );
  }

  const { id } = await params;
  const noteId = Number(id);

  if (!Number.isInteger(noteId) || noteId < 1) {
    return NextResponse.json(
      { error: "ID catatan tidak valid." },
      { status: 400 },
    );
  }

  const existingNote = await prisma.note.findUnique({ where: { id: noteId } });
  if (!existingNote) {
    return NextResponse.json(
      { error: "Catatan tidak ditemukan." },
      { status: 404 },
    );
  }

  await prisma.note.delete({ where: { id: noteId } });
  return NextResponse.json({ message: "Catatan berhasil dihapus." });
}
