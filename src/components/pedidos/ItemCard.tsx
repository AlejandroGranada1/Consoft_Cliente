import { useState } from 'react';

function ItemCard({ prod, imagenes: adminImagenes }: any) {
	// Prioridad de imágenes: 
	// 1. Imagen específica del item (imageUrl)
	// 2. Imagen del producto de catálogo (id_producto)
	// 3. Imagen del servicio (id_servicio) - Fallback
	const imagenOriginal =
		prod.imageUrl ||
		prod.customDetails?.referenceImage ||
		prod.id_producto?.imageUrl ||
		prod.id_producto?.image ||
		prod.id_servicio?.imageUrl ||
		prod.id_servicio?.image;

	// Combinar imagen original con las subidas por el admin
	const todasLasImagenes = [
		...(imagenOriginal ? [{ url: imagenOriginal, _id: 'original', label: 'Original' }] : []),
		...(adminImagenes || [])
	];

	const [imagenSeleccionada, setImagenSeleccionada] = useState(todasLasImagenes[0]?.url ?? null);

	const esAdminFabricador = prod.id_servicio && (prod.id_servicio._id === '6999d686f21e5a62a1823865' || prod.id_servicio === '6999d686f21e5a62a1823865');
	const cleanDetalles = prod.detalles ? prod.detalles.replace('[Personalizado] ', '') : '';
	const displayDetalles = cleanDetalles.length > 40 ? cleanDetalles.substring(0, 40) + '...' : cleanDetalles;

	const nombreItem =
		prod.id_producto?.name ||
		(!esAdminFabricador && prod.id_servicio?.name) ||
		displayDetalles ||
		'Producto';

	return (
		<div className='bg-white border border-gray-200 rounded-xl p-4 text-center shadow-md'>
			{/* Imagen principal */}
			{imagenSeleccionada ? (
				<img
					src={imagenSeleccionada}
					alt={prod.id_producto?.name || prod.id_servicio?.name || 'Imagen'}
					className='w-28 h-28 mx-auto object-contain mb-2 transition-all'
				/>
			) : (
				<div className='w-28 h-28 mx-auto flex items-center justify-center border rounded-md text-gray-500 mb-2'>
					Sin imagen
				</div>
			)}

			<p className='font-medium text-gray-800'>{nombreItem}</p>
			<p className='text-sm text-gray-600'>{displayDetalles == "Sin notas adicionales" ? prod.id_servicio?.name : displayDetalles}</p>

			{/* Miniaturas */}
			{todasLasImagenes.length > 1 && (
				<div className='flex gap-2 justify-center mt-3 flex-wrap'>
					{todasLasImagenes.map((img: any) => (
						<div key={img._id} className="relative group">
							<img
								src={img.url}
								onClick={() => setImagenSeleccionada(img.url)}
								className={`w-10 h-10 object-cover rounded border cursor-pointer ${imagenSeleccionada === img.url
									? 'border-[#8B5E3C] scale-110'
									: 'border-gray-300'
									} transition-all`}
							/>
							{img._id === 'original' && (
								<span className="absolute -top-1 -right-1 bg-[#8B5E3C] text-white text-[8px] px-1 rounded-full pointer-events-none">
									Ref
								</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}


export default ItemCard