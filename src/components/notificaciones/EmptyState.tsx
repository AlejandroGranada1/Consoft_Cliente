// components/notificaciones/EmptyState.tsx
export default function EmptyState() {
	return (
		<div className='bg-white rounded-xl p-8 text-center border shadow-sm max-w-md mx-auto'>
			<div className='text-6xl mb-4'>📭</div>
			<h3 className='text-xl font-semibold text-gray-800 mb-2'>No hay notificaciones</h3>
			<p className='text-gray-600 mb-4'>
				Todavía no tienes cotizaciones procesadas. Cuando envíes una cotización, aquí verás
				su estado y las respuestas del administrador.
			</p>
			<div className='space-y-2 text-sm text-gray-500'>
				<p>
					📦 <strong>Envía una cotización</strong> desde tu carrito
				</p>
				<p>
					⏳ <strong>Espera la respuesta</strong> del administrador
				</p>
				<p>
					🔔 <strong>Recibirás notificaciones</strong> aquí
				</p>
			</div>
		</div>
	);
}
