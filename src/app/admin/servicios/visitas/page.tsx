'use client';
import { Visit } from '@/app/types';
import CreateVisitModal from '@/components/admin/servicios/visitas/CreateVisitModal';
import VisitDetailsModal from '@/components/admin/servicios/visitas/VisitDetailsModal';
import Pagination from '@mui/material/Pagination';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

function page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [visits, setVisits] = useState<Visit[]>([
		{
			id: 'VIS-001',
			scheduledAt: '2025-02-02',
			user: {
				id: '',
				name: 'Raúl',
				email: '',
				address: '',
				phone: '',
				role: {
					id: '',
					name: '',
					description: '',
					usersCount: 0,
					createdAt: '',
					permissions: [],
					status: true,
				},
				featuredProducts: [],
				registeredAt: '',
				status: true,
			},
			address: '',
			services: [],
			status: 'Pendiente',
		},
		{
			id: 'VIS-002',
			scheduledAt: '2025-02-02',
			user: {
				id: '',
				name: 'Raúl 2',
				email: '',
				address: '',
				phone: '',
				role: {
					id: '',
					name: '',
					description: '',
					usersCount: 0,
					createdAt: '',
					permissions: [],
					status: true,
				},
				featuredProducts: [],
				registeredAt: '',
				status: true,
			},
			address: '',
			services: [],
			status: 'Cancelada',
		},
		{
			id: 'VIS-003',
			scheduledAt: '2025-02-02',
			user: {
				id: '',
				name: 'Raúl 3',
				email: '',
				address: '',
				phone: '',
				role: {
					id: '',
					name: '',
					description: '',
					usersCount: 0,
					createdAt: '',
					permissions: [],
					status: true,
				},
				featuredProducts: [],
				registeredAt: '',
				status: true,
			},
			address: 'Mi Casa',
			services: [],
			status: 'Terminada',
		},
	]);
	const [visit, setVisit] = useState<Visit>();
	return (
		<div>
			<header className='flex flex-col h-60 justify-around px-20'>
				<h1 className='text-2xl  text-brown'>GESTION DE VISITAS</h1>
				{/* actions */}
				<div className='flex justify-between items-center'>
					<div className='relative w-64'>
						{/* Icono */}
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						{/* Input */}
						<input
							type='text'
							placeholder='Buscar Visita'
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown'>
						<IoMdAdd size={25} /> Agregar Nueva Visita
					</button>
				</div>
			</header>
			<section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
				<div>
					<div className='grid grid-cols-4 place-items-center py-6'>
						<p>Id de Visita</p>
						<p>Fecha de Visita</p>
						<p>Cliente</p>
						<p>Estado</p>
					</div>

					<div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
						{visits.map((visit) => (
							<div
								onClick={() => {
									setDetailsModal(true);
									setVisit(visit);
								}}
								key={visit.id}
								className='grid grid-cols-4 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
								<p>{visit.id}</p>
								<p>{visit.scheduledAt}</p>
								<p>{visit.user.name}</p>
								<p
									className={`${
										visit.status == 'Terminada'
											? 'bg-green/30 text-green'
											: visit.status == 'Cancelada'
											? 'bg-red/30 text-red'
											: 'bg-orange/30 text-orange'
									} px-2 py-1 rounded-xl`}>
									{visit.status}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(visits.length / 10)} />
				</div>
			</section>
			<CreateVisitModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
			/>
			<VisitDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={visit}
			/>
		</div>
	);
}

export default page;
