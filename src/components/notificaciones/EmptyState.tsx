export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img src="/empty-box.svg" alt="Sin notificaciones" className="w-24 h-24 opacity-70" />
      <p className="mt-4 text-[#1E293B] text-lg">Aún no tienes notificaciones</p>
      <button className="mt-6 px-6 py-2 bg-[#8B5E3C] text-white rounded-xl hover:bg-[#70492F]">
        Explorar productos
      </button>
    </div>
  )
}
