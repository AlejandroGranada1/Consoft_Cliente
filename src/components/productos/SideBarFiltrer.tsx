"use client"

export default function SidebarFilters() {
  return (
    <aside className="w-64 bg-white p-5 rounded-2xl shadow-md h-fit">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Filtros</h3>

      {/* Precio */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Precio base</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 px-2 py-1 border rounded-lg text-gray-800"
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 px-2 py-1 border rounded-lg text-gray-800"
          />
        </div>
      </div>

      {/* Categoría */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Categoría</h4>
        <div className="space-y-2">
          {["Sala de estar", "Oficina", "Comedor"].map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-gray-800">
              <input type="checkbox" className="accent-[#8B5E3C]" />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Descuento */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Descuento</h4>
        <div className="space-y-2">
          {["20% y más", "40% y más", "50% y más"].map((disc) => (
            <label key={disc} className="flex items-center gap-2 text-gray-800">
              <input type="checkbox" className="accent-[#8B5E3C]" />
              {disc}
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}