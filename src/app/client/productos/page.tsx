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
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>

          <label className="font-medium text-sm">Precio base</label>
          <div className="flex gap-3 mt-2 mb-4">
            <input
              className="border rounded-lg px-3 py-2 w-full"
              placeholder="Min"
              value={filters.min}
              onChange={(e) =>
                setFilters((f) => ({ ...f, min: e.target.value }))
              }
            />
            <input
              className="border rounded-lg px-3 py-2 w-full"
              placeholder="Max"
              value={filters.max}
              onChange={(e) =>
                setFilters((f) => ({ ...f, max: e.target.value }))
              }
            />
          </div>
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