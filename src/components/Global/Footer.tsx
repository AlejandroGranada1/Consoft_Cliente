import Link from "next/link";
import { Instagram, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brown text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        
        {/* Branding */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-wide">ConSoft</h2>
          <p className="text-sm text-white/80 leading-relaxed max-w-sm">
            Sistema de gestión desarrollado para Confort & Estilo, enfocado en la
            automatización de ventas, inventario y clientes.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="font-medium mb-4 text-white">Navegación</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link
                href="/"
                className="hover:text-white transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/client/productos"
                className="hover:text-white transition-colors"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/client/servicios"
                className="hover:text-white transition-colors"
              >
                Ventas
              </Link>
            </li>
            <li>
              <Link
                href="/client/agendarvisita"
                className="hover:text-white transition-colors"
              >
                Agendar Visita
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-medium mb-4 text-white">Contacto</h3>

          <div className="space-y-3 text-sm text-white/80">
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <Phone size={18} />
              <span>WhatsApp: +57 300 000 0000</span>
            </a>

            <a
              href="https://instagram.com/consoft"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <Instagram size={18} />
              <span>@consoft</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/20 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} ConSoft. Todos los derechos reservados.
      </div>
    </footer>
  );
}
