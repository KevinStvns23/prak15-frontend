# Notes CRUD — Next.js + Prisma + SQLite

Starter sederhana untuk tugas CRUD. Menggunakan Prisma ORM v6 agar konfigurasi SQLite tetap ringkas. Fitur: tambah, lihat, edit, dan hapus catatan.

## 1. Buat project Next.js

```bash
npx create-next-app@latest notes-app
cd notes-app
```

Saat ditanya, pilih TypeScript, ESLint, App Router, **tanpa `src/` directory**, dan import alias `@/*`. Salin folder/file dari starter ini ke project `notes-app`, lalu izinkan file yang ada untuk diganti.

## 2. Install Prisma

```bash
npm install @prisma/client@6.19.3
npm install -D prisma@6.19.3
```

Buat file `.env` di root project dan isi:

```env
DATABASE_URL="file:./dev.db"
```

Jangan upload `.env` ke GitHub. File `.env.example` boleh di-commit sebagai contoh konfigurasi.

## 3. Buat database dan tabel

```bash
npx prisma migrate dev --name init
```

Perintah ini membuat database `prisma/dev.db` berdasarkan model `Note` di `prisma/schema.prisma`.

## 4. Jalankan aplikasi

```bash
npm run dev
```

Buka http://localhost:3000, kemudian coba tambah beberapa catatan. Tes juga edit dan hapus. Data tersimpan di `prisma/dev.db`.

## 5. Siapkan untuk GitHub dan Vercel

1. Hentikan server lokal setelah data contoh selesai dimasukkan.
2. Pastikan `prisma/dev.db` ikut di-commit. Database ini sengaja disertakan agar catatan contoh dapat dibaca setelah deploy.
3. Jangan commit `.env` atau file rahasia lain.
4. Jika project memakai `.gitignore` bawaan yang mengabaikan file `*.db`, hapus aturan tersebut agar `prisma/dev.db` dapat di-commit.
5. Push project ke GitHub, lalu import repository tersebut ke Vercel dan deploy.

Di mode production, aplikasi membuka SQLite dengan `mode=ro` dan endpoint tambah/edit/hapus mengembalikan status 403. Jadi Vercel hanya menampilkan data yang sudah dimasukkan secara lokal sebelum push. Perubahan data yang dibuat di lokal setelah deployment perlu di-commit dan di-deploy ulang agar tampil di Vercel.

## Catatan

Isi database demo akan terlihat oleh siapa pun yang dapat membuka aplikasi/repository. Gunakan catatan contoh yang tidak berisi informasi pribadi atau rahasia.
