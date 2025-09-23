// app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "ConSoft",
  description: "Aplicación Web desarrollada para Confort & Estilo",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
