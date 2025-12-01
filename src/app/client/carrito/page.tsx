"use client";

import { useCart } from "@/providers/CartContext";
import Swal from "sweetalert2";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();


  const handleSendQuote = async () => {
    if (items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "El carrito está vacío",
        text: "Agrega productos antes de enviar una cotización.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Enviar cotización?",
      text: "Se enviará una solicitud con los productos del carrito.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Cotización enviada",
        text: "Nos pondremos en contacto contigo pronto.",
      });

      clearCart();
    }
  };

  return (
    <section className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Carrito</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-6">
          {items.map((p) => (
            <div
              key={p.uniqueId}     // 👈 Usa el ID único
              className="flex gap-4 bg-white p-4 rounded-xl shadow-md"
            >
              <img
                src={p.image || "/placeholder.png"}
                alt={p.name}
                className="w-24 h-24 object-cover rounded-lg border"
              />

              <div className="flex-1">
                <p className="font-semibold text-lg">{p.name}</p>
                <p className="text-sm text-gray-500">
                  Cantidad: {p.quantity}
                </p>

                {p.color && (
                  <p className="text-sm text-gray-700">Color: {p.color}</p>
                )}
                {p.size && (
                  <p className="text-sm text-gray-700">Tamaño: {p.size}</p>
                )}
                {p.notes && (
                  <p className="text-sm text-gray-700">Notas: {p.notes}</p>
                )}
              </div>

              <div className="text-right">

                <button
                  onClick={() => removeItem(p.uniqueId)}  // 👈 Elimina solo este ítem
                  className="text-red-600 text-sm mt-2 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="flex gap-4 mt-6">
            <button
              onClick={() =>
                Swal.fire({
                  title: "¿Vaciar carrito?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Sí, vaciar",
                  cancelButtonText: "Cancelar",
                }).then((res) => {
                  if (res.isConfirmed) clearCart();
                })
              }
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
            >
              Vaciar carrito
            </button>

            <button
              onClick={handleSendQuote}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 ml-auto"
            >
              Enviar cotización
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
