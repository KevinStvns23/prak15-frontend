"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notes", { cache: "no-store" });
      if (!response.ok) throw new Error("Gagal mengambil catatan.");
      const data = await response.json();
      setNotes(data.notes);
      setReadOnly(data.readOnly);
    } catch {
      setMessage("Catatan gagal dimuat. Pastikan database sudah dibuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  function resetForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setMessage("Judul catatan wajib diisi.");
      return;
    }

    const editing = editingId !== null;
    const response = await fetch(
      editing ? `/api/notes/${editingId}` : "/api/notes",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Terjadi kesalahan.");
      return;
    }

    resetForm();
    setMessage(editing ? "Catatan berhasil diperbarui." : "Catatan berhasil ditambahkan.");
    await loadNotes();
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteNote(id: number) {
    if (!window.confirm("Yakin ingin menghapus catatan ini?")) return;

    const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Catatan gagal dihapus.");
      return;
    }

    setMessage("Catatan berhasil dihapus.");
    await loadNotes();
  }

  return (
    <main className="container">
      <header className="header">
        <p className="eyebrow">APLIKASI SEDERHANA</p>
        <h1>Catatan Saya</h1>
        <p className="subtitle">Simpan ide dan catatan pentingmu di satu tempat.</p>
      </header>

      {readOnly && (
        <div className="notice">
          Mode demo / hanya-baca: catatan dapat dilihat, tetapi tidak dapat diubah.
        </div>
      )}

      {!readOnly && (
        <section className="panel">
          <h2>{editingId === null ? "Tambah Catatan" : "Edit Catatan"}</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Judul</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Ide project"
              maxLength={100}
              required
            />

            <label htmlFor="content">Isi catatan</label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Tulis catatan di sini..."
              rows={4}
            />

            <div className="formActions">
              <button className="primaryButton" type="submit">
                {editingId === null ? "Simpan Catatan" : "Simpan Perubahan"}
              </button>
              {editingId !== null && (
                <button className="secondaryButton" type="button" onClick={resetForm}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      {message && <p className="message">{message}</p>}

      <section className="notesSection">
        <div className="sectionHeading">
          <h2>Daftar Catatan</h2>
          <span>{notes.length} catatan</span>
        </div>

        {loading ? (
          <p className="emptyState">Memuat catatan...</p>
        ) : notes.length === 0 ? (
          <p className="emptyState">Belum ada catatan. Tambahkan catatan pertamamu!</p>
        ) : (
          <div className="notesGrid">
            {notes.map((note) => (
              <article className="noteCard" key={note.id}>
                <h3>{note.title}</h3>
                <p className="noteContent">{note.content || "(Tidak ada isi catatan)"}</p>
                <p className="dateText">
                  Diperbarui: {new Date(note.updatedAt).toLocaleString("id-ID")}
                </p>
                {!readOnly && (
                  <div className="cardActions">
                    <button className="editButton" onClick={() => startEdit(note)}>
                      Edit
                    </button>
                    <button className="deleteButton" onClick={() => void deleteNote(note.id)}>
                      Hapus
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
