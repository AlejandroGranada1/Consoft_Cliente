"use client";

import { useState } from "react";

export default function ProductsPage() {
  const allProducts = [
    {
      id: "1",
      name: "Silla de sala",
      price: 120,
      priceApprox: "$120",
      size: "70x20",
      image: "/sillaProduct.png",
    },
    {
      id: "2",
      name: "Mesa de comedor",
      price: 300,
      priceApprox: "$300",
      size: "30x10",
      image: "/MesaProducts.jpeg",
    },
    {
      id: "3",
      name: "Silla de comedor",
      price: 90,
      priceApprox: "$90",
      size: "26x70",
      image: "/SillaComedorProducts.jpeg",
    },
  ];

  const [filters, setFilters] = useState({ min: "", max: "" });

  const products = allProducts.filter((p) => {
    const minOk = filters.min === "" || p.price >= Number(filters.min);
    const maxOk = filters.max === "" || p.price <= Number(filters.max);
    return minOk && maxOk;
  });

  return (
    <section className="bg-[#f9f9f9] min-h-screen py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 max-w-7xl mx-auto">
        
{/* Filtros */}
<div className="bg-[#f5eee7] rounded-xl p-6 h-fit w-full">

  {/* BUSCADOR */}
  <div className="bg-white/60 rounded-full px-4 py-2 flex items-center gap-2 mb-6">
    <input
      type="text"
      placeholder="Buscar"
      className="bg-transparent outline-none text-sm w-full"
    />
    <span className="text-gray-500 text-sm"></span>
  </div>

  {/* PRECIO BASE */}
  <p className="font-semibold text-sm mb-2">Precio base</p>

  <div className="space-y-3 mb-6">
    <div>
      <p className="text-xs mb-1">Min</p>
      <input
        className="bg-white/60 rounded-full px-4 py-2 w-full outline-none text-sm"
        placeholder=""
        value={filters.min}
        onChange={(e) =>
          setFilters((f) => ({ ...f, min: e.target.value }))
        }
      />
    </div>

    <div>
      <p className="text-xs mb-1">Max</p>
      <input
        className="bg-white/60 rounded-full px-4 py-2 w-full outline-none text-sm"
        placeholder=""
        value={filters.max}
        onChange={(e) =>
          setFilters((f) => ({ ...f, max: e.target.value }))
        }
      />
    </div>
  </div>

  {/* SEPARADOR */}
  <div className="border-t border-gray-300 my-4"></div>

  {/* CATEGORÍAS */}
  <div className="space-y-3">
    <p className="font-semibold text-sm">Categorías</p>

    <label className="flex items-center justify-between text-sm">
      Oficina
      <input type="checkbox" className="h-4 w-4" />
    </label>

    <label className="flex items-center justify-between text-sm">
      Sala de estar
      <input type="checkbox" className="h-4 w-4" />
    </label>

    <label className="flex items-center justify-between text-sm">
      Sillas de comedor
      <input type="checkbox" className="h-4 w-4" />
    </label>

    <label className="flex items-center justify-between text-sm">
      Habitación
      <input type="checkbox" className="h-4 w-4" />
    </label>
  </div>

  {/* SEPARADOR */}
  <div className="border-t border-gray-300 mt-4"></div>
</div>

        {/* Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <a
              key={product.id}
              href={`/client/productos/${product.id}`}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center hover:shadow-lg transition"
            >
              <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain w-full h-full p-2"
                />
              </div>

              <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
              <p className="text-gray-700 text-sm">Precio aprox: {product.priceApprox}</p>
              <p className="text-gray-500 text-xs">Tamaño: {product.size}</p>

              <div className="mt-4 w-full bg-[#8B5A2B] text-white text-center py-2 rounded-lg">
                Ver detalle
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}