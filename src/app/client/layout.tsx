import "../globals.css";
import Navbar from "@/components/Global/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
