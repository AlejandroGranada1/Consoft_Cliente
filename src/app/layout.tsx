// app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { UserProvider } from "@/context/userContext";

export const metadata: Metadata = {
  title: "ConSoft",
  description: "Aplicación Web desarrollada para Confort & Estilo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <UserProvider>
        <body>{children}</body>
      </UserProvider>
    </html>
  );
}
