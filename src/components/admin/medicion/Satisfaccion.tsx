'use client';
import React from 'react';
import { FaStar } from 'react-icons/fa';

function Satisfaccion() {
	const distribucion = [
		{ estrellas: 5, cantidad: 892, porcentaje: 61 },
		{ estrellas: 4, cantidad: 345, porcentaje: 24 },
		{ estrellas: 3, cantidad: 156, porcentaje: 11 },
		{ estrellas: 2, cantidad: 45, porcentaje: 3 },
		{ estrellas: 1, cantidad: 18, porcentaje: 1 },
	];

	const totalResenas = 1456;
	const promedio = 4.8;

	return (
		<section className='grid grid-cols-2 gap-4 mt-6'>
			{/* Distribución de calificaciones */}
			<div className='border rounded-xl p-4'>
				<h2 className='text-lg font-semibold'>Distribución de Calificaciones</h2>
				<p className='text-sm text-gray-600 mb-4'>
					Análisis detallado de las calificaciones recibidas
				</p>

				<div className='space-y-3'>
					{distribucion.map((d) => (
						<div
							key={d.estrellas}
							className='flex items-center justify-between'>
							{/* Estrellas */}
							<div className='flex items-center space-x-1 w-1/4'>
								{Array.from({ length: 5 }).map((_, i) => (
									<FaStar
										key={i}
										className={
											i < d.estrellas ? 'text-yellow-400' : 'text-gray-300'
										}
									/>
								))}
								<span className='text-sm text-gray-600'>({d.cantidad})</span>
							</div>

							{/* Barra */}
							<div className='flex items-center space-x-2 w-1/2'>
								<meter
									min={0}
									max={100}
									value={d.porcentaje}
									className='w-full'></meter>
								<span className='text-sm'>{d.porcentaje}%</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Resumen de satisfacción */}
			<div className='border rounded-xl p-4 flex flex-col items-center justify-center'>
				<h2 className='text-lg font-semibold'>Resumen de Satisfacción</h2>
				<p className='text-sm text-gray-600 mb-4'>
					Métricas clave de satisfacción del cliente
				</p>

				<div className='text-center'>
					<p className='text-4xl font-bold'>{promedio}</p>
					<div className='flex justify-center my-2'>
						{Array.from({ length: 5 }).map((_, i) => (
							<FaStar
								key={i}
								className={
									i < Math.round(promedio) ? 'text-yellow-400' : 'text-gray-300'
								}
							/>
						))}
					</div>
					<p className='text-sm text-gray-500'>
						Basado en {totalResenas.toLocaleString()} reseñas
					</p>
				</div>

				{/* Lista porcentual */}
				<ul className='mt-4 text-sm space-y-1'>
					{distribucion.map((d) => (
						<li
							key={d.estrellas}
							className='flex justify-between w-48'>
							<span>
								{d.estrellas === 5 && 'Excelente (5★)'}
								{d.estrellas === 4 && 'Muy bueno (4★)'}
								{d.estrellas === 3 && 'Bueno (3★)'}
								{d.estrellas === 2 && 'Regular (2★)'}
								{d.estrellas === 1 && 'Malo (1★)'}
							</span>
							<span>{d.porcentaje}%</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default Satisfaccion;
