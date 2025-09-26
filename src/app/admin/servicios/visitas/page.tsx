'use client';
import { Visit } from '@/app/types';
import CreateVisitModal from '@/components/admin/servicios/visitas/CreateVisitModal';
import VisitDetailsModal from '@/components/admin/servicios/visitas/VisitDetailsModal';
import PaginatedList from '@/components/Global/Pagination';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import api from '@/components/Global/axios';
import { deleteElement } from '@/components/admin/global/alerts';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [visits, setVisits] = useState<Visit[]>([]);
	const [visit, setVisit] = useState<Visit>();
	const [filterText, setFilterText] = useState('');

	// 🔹 Traer visitas desde API
	const fetchVisits = async () => {
		try {
			const response = await api.get('/api/visits');
			setVisits(response.data.visits); // ajusta según tu respuesta de API
		} catch (err) {
			console.error('Error al traer visitas:', err);
		}
	};

	useEffect(() => {
		fetchVisits();
	}, []);

	console.log(visits);
	// Filtrar visitas
	const filteredVisits = visits.filter(
		(v) =>
			v._id?.toLowerCase().includes(filterText.toLowerCase()) ||
			v.user.name.toLowerCase().includes(filterText.toLowerCase()) ||
			v.status.toLowerCase().includes(filterText.toLowerCase())
	);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE VISITAS
				</h1>

				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							placeholder='Buscar Visita'
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center justify-center py-2 px-6 md:px-10 border border-brown rounded-lg cursor-pointer text-brown w-full md:w-fit'>
						<IoMdAdd
							size={25}
							className='mr-2'
						/>{' '}
						Agregar Nueva Visita
					</button>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* Encabezado tabla desktop */}
				<div className='hidden md:grid grid-cols-5 place-items-center py-6 font-semibold'>
					<p>ID de Visita</p>
					<p>Fecha</p>
					<p>Cliente</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* Listado con paginación */}
				<PaginatedList
					data={filteredVisits}
					itemsPerPage={5}>
					{(v: Visit) => (
						<div
							key={v._id}
							className='grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2'>
							{/* Vista mobile */}
							<div className='w-full md:hidden text-center space-y-2 border-b pb-4'>
								<p>
									<span className='font-semibold'>ID:</span> {v._id}
								</p>
								<p>
									<span className='font-semibold'>Fecha:</span>{' '}
									{new Date(v.visitDate).toLocaleDateString()}
								</p>
								<p>
									<span className='font-semibold'>Cliente:</span> {v.user.name}
								</p>
								<p>
									<span className='font-semibold'>Estado:</span>{' '}
									<span
										className={`${
											v.status === 'Terminada'
												? 'text-green-500'
												: v.status === 'Cancelada'
												? 'text-red-500'
												: 'text-orange-500'
										}`}>
										{v.status}
									</span>
								</p>
								<div className='flex gap-4 mt-2 justify-center'>
									<FaEye
										size={20}
										color='#d9b13b'
										onClick={() => {
											setDetailsModal(true);
											setVisit(v);
										}}
										cursor='pointer'
									/>
									<FaTrash
										size={19}
										color='#fa4334'
										onClick={() =>
											deleteElement(
												'Visita',
												`/api/visits/${v._id}`,
												fetchVisits
											)
										}
										cursor='pointer'
									/>
								</div>
							</div>

							{/* Vista desktop */}
							<p className='truncate w-40 hidden md:block'>{v._id}</p>
							<p className='hidden md:block'>
								{new Date(v.visitDate).toLocaleDateString()}
							</p>
							<p className='hidden md:block'>{v.user.name}</p>
							<p
								className={`hidden md:block px-2 py-1 rounded-xl ${
									v.status === 'Terminada'
										? 'bg-green/30 text-green'
										: v.status === 'Cancelada'
										? 'bg-red/30 text-red'
										: 'bg-orange/30 text-orange'
								}`}>
								{v.status}
							</p>
							<div className='flex gap-4 mt-2 justify-center'>
								<FaEye
									size={20}
									color='#d9b13b'
									onClick={() => {
										setDetailsModal(true);
										setVisit(v);
									}}
									cursor='pointer'
								/>
								<FaTrash
									size={19}
									color='#fa4334'
									onClick={() =>
										deleteElement('Visita', `/api/visits/${v._id}`, fetchVisits)
									}
									cursor='pointer'
								/>
							</div>
						</div>
					)}
				</PaginatedList>
			</section>

			{/* Modales */}
			<CreateVisitModal
				isOpen={createModal}
				onClose={() => {
					setCreateModal(false);
					fetchVisits();
				}}
			/>
			<VisitDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={visit}
				updateList={() => fetchVisits()}
			/>
		</div>
	);
}

export default Page;
