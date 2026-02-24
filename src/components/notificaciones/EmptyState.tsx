export default function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-[#1a1917] p-12 max-w-md mx-auto text-center gap-6">

			{/* Icon */}
			<div className="w-16 h-16 rounded-full bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 flex items-center justify-center">
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
					<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>

			{/* Text */}
			<div className="flex flex-col gap-2">
				<h3 className="font-serif text-xl font-medium text-[#f0e8d8]">
					Sin notificaciones
				</h3>
				<p className="text-sm text-[#6b5b4e] leading-relaxed">
					Todavía no tienes cotizaciones procesadas. Cuando envíes una, verás su estado y las respuestas aquí.
				</p>
			</div>

			{/* Steps */}
			<div className="flex flex-col gap-3 w-full">
				{[
					{ icon: '📦', label: 'Envía una cotización', sub: 'desde tu carrito' },
					{ icon: '⏳', label: 'Espera la respuesta', sub: 'del administrador' },
					{ icon: '🔔', label: 'Recibe notificaciones', sub: 'aquí mismo' },
				].map((s, i) => (
					<div
						key={i}
						className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-[#151413]"
					>
						<span className="text-lg">{s.icon}</span>
						<div className="text-left">
							<p className="text-xs font-medium text-[#c4b8a8]">{s.label}</p>
							<p className="text-[11px] text-[#4a3f35]">{s.sub}</p>
						</div>
					</div>
				))}
			</div>

		</div>
	);
}