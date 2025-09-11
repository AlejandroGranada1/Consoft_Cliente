'use client';
import Resumen from '@/components/admin/medicion/Resumen';
import Satisfaccion from '@/components/admin/medicion/Satisfaccion';
import Servicios from '@/components/admin/medicion/Servicios';
import Tendencias from '@/components/admin/medicion/Tendencias';
import React, { useState } from 'react';
import { FaChartBar, FaMoneyBill, FaRegStar, FaUsers } from 'react-icons/fa';

function page() {
	const [tab, setTab] = useState('resumen');
	return (
		<div>
			<header className='flex flex-col h-85 justify-evenly px-20'>
				<h1 className='text-2xl  text-brown'>MEDICIÓN Y DESEMPEÑO</h1>
				<div className='grid grid-cols-4 place-items-center'>
					<div className='border rounded-lg size-48 flex flex-col justify-between p-4'>
						<h3 className='flex items-center gap-2'>
							Usuarios totales <FaUsers />
						</h3>
						<p>12,847</p>
						<p className='text-xs text-gray'>Vs 8,234 registrados este mes</p>
						<p className='text-xs text-green'>+56%</p>
					</div>

					<div className='border rounded-lg size-48 flex flex-col justify-between p-4'>
						<h3 className='flex items-center gap-2'>
							Ingresos totales <FaMoneyBill />
						</h3>
						<p>$12,847,035</p>
					</div>

					<div className='border rounded-lg size-48 flex flex-col justify-between p-4'>
						<h3 className='flex items-center gap-2'>
							Calificacion Promedio{' '}
							<FaRegStar
								color={'#CACC62'}
								size={50}
							/>
						</h3>
						<p>4.8/5</p>
						<p className='text-xs text-gray'>Basado en 1,456 reseñas</p>
						<p className='text-xs text-green'>
							+0.3% <span className='text-black'>desde el mes pasado</span>
						</p>
					</div>

					<div className='border rounded-lg size-48 flex flex-col justify-between p-4'>
						<h3 className='flex items-center gap-2'>
							Tasa de conversión{' '}
							<FaChartBar
								color='blue'
								size={50}
							/>
						</h3>
						<p>3.2%</p>
						<p className='text-xs text-gray'>de visitas a pedidos</p>
						<p className='text-xs text-green'>
							+0.8% <span className='text-black'>desde el mes pasado</span>
						</p>
					</div>
				</div>
			</header>

			<section>
				<div className='p-6'>
					{/* Chips de navegación */}
					<div className='flex gap-4 mb-6'>
						<button
							onClick={() => setTab('resumen')}
							className={`px-4 py-2 rounded-full ${
								tab === 'resumen' ? 'bg-blue-500 text-white' : 'bg-gray-200'
							}`}>
							Resumen General
						</button>
						<button
							onClick={() => setTab('servicios')}
							className={`px-4 py-2 rounded-full ${
								tab === 'servicios' ? 'bg-blue-500 text-white' : 'bg-gray-200'
							}`}>
							Servicios Populares
						</button>
						<button
							onClick={() => setTab('satisfaccion')}
							className={`px-4 py-2 rounded-full ${
								tab === 'satisfaccion' ? 'bg-blue-500 text-white' : 'bg-gray-200'
							}`}>
							Satisfacción
						</button>
						<button
							onClick={() => setTab('tendencias')}
							className={`px-4 py-2 rounded-full ${
								tab === 'tendencias' ? 'bg-blue-500 text-white' : 'bg-gray-200'
							}`}>
							Tendencias
						</button>
					</div>

					{/* Contenido dinámico */}
					<div className='h-fit'>
						{tab === 'resumen' && <Resumen />}
						{tab === 'servicios' && <Servicios />}
						{tab === 'satisfaccion' && <Satisfaccion />}
						{tab === 'tendencias' && <Tendencias/>}
					</div>
				</div>
			</section>
		</div>
	);
}

export default page;
