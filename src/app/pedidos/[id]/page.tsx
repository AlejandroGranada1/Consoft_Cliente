"use client"

import { useParams, useRouter } from "next/navigation"

const pedidos = [
  {
    id: "1",
    estado: "Pendiente",
    fecha: "4 julio",
    precio: "$94.000 COP",
    productos: [
      { id: "p1", nombre: "Silla Reclinable", estado: "Aun no terminado" },
      { id: "p2", nombre: "Silla Reclinable", estado: "Aun no terminado" },
      { id: "p3", nombre: "Silla Reclinable", estado: "Aun no terminado" },
    ],
  },
  {
    id: "2",
    estado: "Completado",
    fecha: "4 julio",
    precio: "$94.000 COP",
    productos: [
      { id: "p1", nombre: "Silla Reclinable", img: "/silla.png" },
      { id: "p2", nombre: "Silla Reclinable", img: "/silla.png" },
      { id: "p3", nombre: "Silla Reclinable", img: "/silla.png" },
    ],
  },
]

export default function PedidoDetallePage() {
  const { id } = useParams()
  const router = useRouter()
  const pedido = pedidos.find((p) => p.id === id)

  if (!pedido) return <p>No existe el pedido</p>

  const handleAction = () => {
    router.push(`/pagos/${pedido.id}`)
  }

  return (
    <main className="p-6 bg-[#FAF4EF] min-h-screen flex flex-col justify-between">
      <div>
        {/* Botón volver */}
        <button
          onClick={() => router.push("/pedidos")}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#6B4226] text-white rounded-full shadow hover:bg-[#4e2f1b] transition-colors"
        >
          Volver
        </button>

        <h1 className="text-center text-2xl font-bold text-[#5C3A21] mb-8">
          Productos
        </h1>

        {/* Grid productos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {pedido.productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-md"
            >
              {prod.img ? (
                <img
                  src={prod.img}
                  alt={prod.nombre}
                  className="w-28 h-28 mx-auto object-contain mb-2"
                />
              ) : (
                <div className="w-28 h-28 mx-auto flex items-center justify-center border rounded-md text-gray-500 mb-2">
                  {prod.estado}
                </div>
              )}
              <p className="font-medium text-gray-800">{prod.nombre}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-[#8B5E3C] font-semibold">Detalles</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-6 text-lg">
          <div>
            <p className="font-semibold text-[#8B5E3C]">Fecha de entrega</p>
            <p>{pedido.fecha}</p>
          </div>
          <div>
            <p className="font-semibold text-[#8B5E3C]">Estado</p>
            <p>{pedido.estado}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold text-[#8B5E3C]">Precio acordado</p>
            <p>{pedido.precio}</p>
          </div>
        </div>
      </div>

      {/* Botón acción abajo */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleAction}
          className="px-6 py-2 bg-[#8B5E3C] text-white rounded-full shadow hover:bg-[#5C3A21] transition-colors flex items-center gap-2"
        >
          Pagar Total/Abonar
        </button>
      </div>
    </main>
  )
}
