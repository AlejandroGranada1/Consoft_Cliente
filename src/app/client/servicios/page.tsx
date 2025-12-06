'use client';

import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import ReviewCard from '@/components/servicios/ReviewCard';
import Link from 'next/link';
import api from '@/components/Global/axios';
import ServiceCard from '@/components/servicios/ServiceCard';
import { Service } from '@/lib/types';
import { useGetServices } from '@/hooks/apiHooks';
export default function ServiciosPage() {
	const { data: services, isLoading } = useGetServices();

	if (isLoading) return <p>Cargando servicios...</p>;
	return (
		<section className='px-6 py-12 bg-[#fff9f6]'>
			<div className='max-w-6xl mx-auto'>
				{/* --- Sección 1: Tarjetas de servicios --- */}
				<h1 className='text-3xl font-bold text-center text-[#4b2e1a] mb-10'>Servicios</h1>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-20'>
					{services?.map((service) => (
						<ServiceCard
							description={service.description!}
							image={service.imageUrl!}
							title={service.name}
							key={service._id}
						/>
					))}
				</div>

				{/* --- Sección 2: Servicio destacado --- */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-20'>
					{/* Imagen */}
					<div className='relative'>
						<img
							src='/imagen2.png'
							alt='Fabricación a tu gusto'
							className='w-full h-80 object-cover rounded-xl shadow-md'
						/>
						{/* Tarjeta pequeña con estrellas */}
						<div className='absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 flex items-center space-x-2'>
							<img
								src='/mini.png'
								alt='mini'
								className='w-12 h-12 rounded-md object-cover'
							/>
							<div className='flex text-yellow-500'>
								<Star className='w-4 h-4 fill-current' />
								<Star className='w-4 h-4 fill-current' />
								<Star className='w-4 h-4 fill-current' />
								<Star className='w-4 h-4 fill-current' />
								<Star className='w-4 h-4' />
							</div>
						</div>
					</div>

					{/* Texto */}
					<div>
						<h2 className='text-3xl font-bold text-[#4b2e1a] mb-6 text-center '>
							Fabricación a tu gusto
						</h2>
						<ul className='space-y-3 text-gray-700 text-center '>
							<li>✨ Diseño 100% personalizado</li>
							<li>🪵 Selección de materiales</li>
							<li>👁️ Asesoría y visualización previa</li>
						</ul>
						<Link href='/agendarcita'>
							<Button className='mt-6 bg-[#4b2e1a] hover:bg-[#3a2314] text-white px-6 py-3 rounded-full text-lg shadow-md ml-50'>
								Agenda tu Cita
							</Button>
						</Link>
					</div>
				</div>

				{/* --- Sección 3: Reseñas --- */}
				<h2 className='text-2xl font-semibold text-[#4b2e1a] mt-12 mb-6 text-center'>
					Reseñas
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<ReviewCard
						name='Laura G.'
						location='Medellín'
						comment='El comedor que me fabricaron quedó perfecto. Pudieron ajustar las medidas y el acabado fue incluso mejor de lo que esperaba.'
						rating={4}
						avatar='/laura.png'
					/>
				</div>
			</div>
		</section>
	);
}
