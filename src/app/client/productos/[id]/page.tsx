"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/providers/CartContext";
import Swal from "sweetalert2";
import { useGetProductById } from '@/hooks/apiHooks';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  console.log(id)

  const { data: product, isLoading } = useGetProductById(String(id));

  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [notes, setNotes] = useState("");

  const addToCart = () => {
    if (!product) return;

    addItem({
      id: product._id,
      name: product.name,
      quantity,
      color,
      size: customSize,
      notes,
      image: product.imageUrl,
    });

    Swal.fire({
      title: "Añadido al carrito",
      text: "El producto ha sido añadido correctamente",
      icon: "success",
      confirmButtonColor: "#8B5A2B",
    });

    router.push("/client/productos");
  };

  if (isLoading) return <p className="p-10">Cargando producto...</p>;
  if (!product) return <p className="p-10">Producto no encontrado</p>;

  return (
    <section className="bg-[#f2f2f2] min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Imagen */}
          <div className="w-full h-80 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-contain h-full p-4"
            />
          </div>

          {/* Información */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2 leading-relaxed">{product.description}</p>

            <div className="mt-5">
            </div>

            <hr className="my-6" />

            <div className="space-y-4">

              <div>
                <label className="font-medium mr-4">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input-style w-24"
                />
              </div>

              <div>
                <label className="font-medium">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="input-style w-full"
                  placeholder="Ej: Nogal, blanco..."
                />
              </div>

              <div>
                <label className="font-medium">Tamaño personalizado</label>
                <input
                  type="text"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  className="input-style w-full"
                  placeholder="Ej: 50x40"
                />
              </div>

              <div>
                <label className="font-medium">Notas adicionales</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-style w-full h-24"
                  placeholder="Detalles, aclaraciones o ideas..."
                />
              </div>

              <button
                onClick={addToCart}
                className="w-full bg-[#8B5A2B] hover:bg-[#70461f] text-white py-3 rounded-lg font-semibold transition"
              >
                Agregar al carrito
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
