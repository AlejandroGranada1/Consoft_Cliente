import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-sky-900 text-sky-50 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Marca */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">ConSoft</h2>
          <p className="text-sm text-sky-200 leading-relaxed">
            Sistema de gestión desarrollado para Confort & Estilo, enfocado en la
            automatización de ventas, inventario y clientes.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="font-medium mb-3">Navegación</h3>
          <ul className="space-y-2 text-sm text-sky-200">
            <li><Link href="/" className="hover:text-white">Inicio</Link></li>
            <li><Link href="/client/productos" className="hover:text-white">Productos</Link></li>
            <li><Link href="/client/servicios" className="hover:text-white">Ventas</Link></li>
            <li><Link href="/client/agendarvisita" className="hover:text-white">Agendar Visita</Link></li>
          </ul>
        </div>

      </div>


      {/* Línea inferior */}
      <div className="border-t border-sky-800 py-4 text-center text-xs text-sky-300">
        © {new Date().getFullYear()} ConSoft. Todos los derechos reservados.
      </div>
    </footer>
  );
}
