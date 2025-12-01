"use client";

import Link from "next/link";
import { useCart } from "@/providers/CartContext";
import { X } from "lucide-react";

export default function CartDropdown({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const { items, removeItem } = useCart();

  // 🔥 Cálculo del total (ANTES fallaba porque no existía en el contexto)

  if (!isOpen) return null;

  const handleGoToCart = () => {
    setIsOpen(false); // Cierra el dropdown al navegar
  };

  return (
    <div className="absolute right-0 top-14 w-80 bg-white shadow-xl rounded-xl p-5 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Carrito</h3>
        <button onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
            >
              <img
                src={p.image || "/placeholder.png"}
                className="w-16 h-16 rounded-lg object-cover border"
                alt={p.name}
              />

              <div className="flex-1">
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-gray-500">Cantidad: {p.quantity}</p>
                {p.color && (
                  <p className="text-xs text-gray-700">Color: {p.color}</p>
                )}
                {p.size && (
                  <p className="text-xs text-gray-700">Tamaño: {p.size}</p>
                )}
              </div>

              <div className="text-right">

                <button
                  onClick={() => removeItem(p.uniqueId)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {items.length > 0 && (
        <>

          <Link
            href="/client/carrito"
            onClick={handleGoToCart}
            className="block text-center mt-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Ver carrito
          </Link>
        </>
      )}
    </div>
  );
}
