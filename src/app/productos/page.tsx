"use client"

import ProductCard from "@/components/productos/ProductCard"
import SidebarFilters from "@/components/productos/SideBarFiltrer"

const products = [
  {
    id: "1",
    name: "Silla de sala",
    price: "$120",
    image: "/sillaProduct.png",
  },
  {
    id: "2",
    name: "Mesa de comedor",
    price: "$300",
    image: "/MesaProducts.jpeg",
  },
  {
    id: "3",
    name: "Silla de comedor",
    price: "$90",
    image: "/SillaComedorProducts.jpeg",
  },
]

export default function ProductsPage() {
  return (
    <section className="bg-[#f9f9f9] min-h-screen py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 max-w-7xl mx-auto">
        
        {/* Sidebar */}
        <SidebarFilters />

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
