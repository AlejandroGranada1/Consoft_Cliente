import { useState } from 'react';

function ItemCard({ prod, imagenes }: any) {
	const [imagenSeleccionada, setImagenSeleccionada] = useState(imagenes[0]?.url ?? null);

	return (
		<div className='bg-white border border-gray-200 rounded-xl p-4 text-center shadow-md'>
			{/* Imagen principal */}
			{imagenSeleccionada ? (
				<img
					src={imagenSeleccionada}
					alt={prod.id_servicio?.name || 'Imagen'}
					className='w-28 h-28 mx-auto object-contain mb-2 transition-all'
				/>
			) : (
				<div className='w-28 h-28 mx-auto flex items-center justify-center border rounded-md text-gray-500 mb-2'>
					Sin imagen
				</div>
			)}

			<p className='font-medium text-gray-800'>{prod.id_servicio?.name || 'Servicio'}</p>

			{/* Miniaturas */}
			{imagenes.length > 1 && (
				<div className='flex gap-2 justify-center mt-3'>
					{imagenes.map((img: any) => (
						<img
							key={img._id}
							src={img.url}
							onClick={() => setImagenSeleccionada(img.url)}
							className={`w-10 h-10 object-cover rounded border cursor-pointer ${
								imagenSeleccionada === img.url
									? 'border-[#8B5E3C] scale-110'
									: 'border-gray-300'
							} transition-all`}
						/>
					))}
				</div>
			)}
		</div>
	);
}


export default ItemCard