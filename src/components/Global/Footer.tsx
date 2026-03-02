import Link from "next/link";
import { Instagram, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-[#0e0d0c] via-[#2a1f18] to-[#0e0d0c] text-white border-t border-white/10">

      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Branding */}
        <span className="font-serif text-base font-medium text-white tracking-wide whitespace-nowrap">
          Confort <span className="text-white/60">&</span> Estilo
        </span>

        {/* Nav links */}
        <div className="flex items-center gap-5 flex-wrap justify-center">
          {[
            { label: 'Inicio', href: '/' },
            { label: 'Referencias', href: '/client/productos' },
            { label: 'Servicios', href: '/client/servicios' },
            { label: 'Agendar visita', href: '/client/agendarcita' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contacto */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/573054579487"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors duration-200"
          >
            <Phone size={13} />
            +57 305 4579487
          </a>
          <a
            href="https://instagram.com/conforstilo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors duration-200"
          >
            <Instagram size={13} />
            @consoft
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-2.5 px-8 text-center">
        <p className="text-[11px] text-white/40">
          © {new Date().getFullYear()} Confort & Estilo · Diseño · Restauración · Medellín
        </p>
      </div>

    </footer>
  );
}