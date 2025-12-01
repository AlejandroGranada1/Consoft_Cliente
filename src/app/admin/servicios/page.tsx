'use client';
import { Service } from '@/app/types';
import CreateServiceModal from '@/components/admin/servicios/servicios/CreateService';
import EditServiceModal from '@/components/admin/servicios/servicios/EditService';
import ServiceDetailsModal from '@/components/admin/servicios/servicios/ServiceDetails';
import { deleteElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import PaginatedList from '@/components/Global/Pagination';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaTrash, FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [service, setService] = useState<Service>();
	const [services, setServices] = useState<Service[]>([]);
	const [filterText, setFilterText] = useState('');

	const fetchServices = async () => {
		try {
			const response = await api.get('/api/services');
			setServices(response.data);
		} catch (err) {
			console.error('Error al traer servicios', err);
		}
	};

	useEffect(() => {
		fetchServices();
	}, []);

	const filteredServices = services.filter(
		(s) =>
			s.name.toLowerCase().includes(filterText.toLowerCase()) ||
			s.description?.toLowerCase().includes(filterText.toLowerCase())
	);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE SERVICIOS
				</h1>

				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							placeholder='Buscar Servicio'
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
						Agregar Nuevo Servicio
					</button>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* Encabezado desktop */}
				<div className='hidden md:grid grid-cols-4 place-items-center py-6 font-semibold'>
					<p>Servicio</p>
					<p>Descripción</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* Listado con paginación */}
				<PaginatedList
					data={filteredServices}
					itemsPerPage={5}>
					{(s: Service) => (
						<div
							key={s._id}
							className='grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2 hover:shadow-md transition-shadow cursor-pointer'>
							{/* Mobile */}
							<div className='w-full md:hidden text-center space-y-2 border-b pb-4'>
								<p>
									<span className='font-semibold'>Servicio:</span> {s.name}
								</p>
								<p>
									<span className='font-semibold'>Descripción:</span>{' '}
									{s.description}
								</p>
								<p>
									<span className='font-semibold'>Estado:</span>{' '}
									<span
										className={`px-2 py-1 rounded-xl ${
											s.status
												? 'bg-green/30 text-green'
												: 'bg-red/30 text-red'
										}`}>
										{s.status ? 'Activo' : 'Inactivo'}
									</span>
								</p>
								<div className='flex gap-4 mt-2 justify-center'>
									<FaEye
										size={20}
										color='#d9b13b'
										onClick={() => {
											setDetailsModal(true);
											setService(s);
										}}
										cursor='pointer'
									/>
									<FaEdit
										size={20}
										color='#7588f0'
										onClick={() => {
											setEditModal(true);
											setService(s);
										}}
										cursor='pointer'
									/>
									<FaTrash
										size={19}
										color='#fa4334'
										onClick={() =>
											deleteElement(
												'Servicio',
												`/api/services/${s._id}`,
												fetchServices
											)
										}
										cursor='pointer'
									/>
								</div>
							</div>

							{/* Desktop */}
							<p className='hidden md:block'>{s.name}</p>
							<p className='hidden md:block truncate'>{s.description}</p>
							<p
								className={`hidden md:block px-2 py-1 rounded-xl text-center font-semibold ${
									s.status ? 'bg-green/30 text-green' : 'bg-red/30 text-red'
								}`}>
								{s.status ? 'Activo' : 'Inactivo'}
							</p>
							<div className='flex gap-4 mt-2 justify-center'>
								<FaEye
									size={20}
									color='#d9b13b'
									onClick={() => {
										setDetailsModal(true);
										setService(s);
									}}
									cursor='pointer'
								/>
								<FaEdit
									size={20}
									color='#7588f0'
									onClick={() => {
										setEditModal(true);
										setService(s);
									}}
									cursor='pointer'
								/>
								<FaTrash
									size={19}
									color='#fa4334'
									onClick={() =>
										deleteElement(
											'Servicio',
											`/api/services/${s._id}`,
											fetchServices
										)
									}
									cursor='pointer'
								/>
							</div>
						</div>
					)}
				</PaginatedList>
			</section>

			{/* Modales */}
			<CreateServiceModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={fetchServices}
			/>
			<EditServiceModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={service}
				updateList={fetchServices}
			/>
			<ServiceDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={service}
			/>
		</div>
	);
}

export default Page;
