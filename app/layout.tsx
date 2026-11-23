import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catatan Saya",
  description: "Aplikasi catatan sederhana menggunakan Next.js, Prisma, dan SQLite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
