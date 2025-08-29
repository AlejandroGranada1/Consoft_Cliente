
import "./globals.css";
import Navbar from "@/components/Global/Navbar";


export const metadata = {
  title: "ConSoft",
  description: "Pagina realizada paa la empresa de Confort & Estilo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Navbar/>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}