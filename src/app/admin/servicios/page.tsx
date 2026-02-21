'use client';
import { Pencil, Eye, Trash2, Search, Plus } from 'lucide-react';
import { Service } from '@/lib/types';
import CreateServiceModal from '@/components/admin/servicios/servicios/CreateService';
import EditServiceModal from '@/components/admin/servicios/servicios/EditService';
import ServiceDetailsModal from '@/components/admin/servicios/servicios/ServiceDetails';
import React, { useEffect, useState } from 'react';
import { useDeleteService, useGetServices } from '@/hooks/apiHooks';
import ServiceRow from '@/components/admin/servicios/servicios/ServiceRow';
import Pagination from '@/components/Global/Pagination';
import Swal from 'sweetalert2';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [service, setService] = useState<Service>();
	const [filterText, setFilterText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const { data } = useGetServices();
	const deleteService = useDeleteService();
	const services = data?.data || [];

	const filteredServices = services.filter(
		(s: Service) =>
			s.name.toLowerCase().includes(filterText.toLowerCase()) ||
			s.description?.toLowerCase().includes(filterText.toLowerCase()),
	);

	const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

	useEffect(() => { setCurrentPage(1); }, [filterText]);

	const handleDeleteService = async (serviceToDelete: Service) => {
		const result = await Swal.fire({
			title: '¿Eliminar servicio?',
			text: `"${serviceToDelete.name}" será eliminado permanentemente`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#c0392b',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		});

		if (!result.isConfirmed) return;

		try {
			await deleteService.mutateAsync(serviceToDelete._id!);
			Swal.fire('Eliminado', 'El servicio fue eliminado correctamente', 'success');
		} catch {
			Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
		}
	};

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE SERVICIOS
				</h1>

				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
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
						className='flex items-center justify-center py-2 px-6 md:px-10 border border-brown rounded-lg cursor-pointer text-brown w-full md:w-fit hover:bg-brown hover:text-white transition'>
						<Plus size={25} className='mr-2' />
						Agregar Nuevo Servicio
					</button>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				<div className='hidden md:grid grid-cols-4 place-items-center py-6 font-semibold'>
					<p>Servicio</p>
					<p>Descripción</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{currentServices.length > 0 ? (
					currentServices.map((s: Service) => (
						<ServiceRow
							key={s._id}
							service={s}
							onDelete={() => handleDeleteService(s)}
							onView={() => { setDetailsModal(true); setService(s); }}
							onEdit={() => { setEditModal(true); setService(s); }}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>No hay servicios para mostrar</div>
				)}

				{totalPages > 1 && (
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={(_, newPage) => setCurrentPage(newPage)}
						className='mt-6'
					/>
				)}
			</section>

			<CreateServiceModal isOpen={createModal} onClose={() => setCreateModal(false)} />
			<EditServiceModal isOpen={editModal} onClose={() => setEditModal(false)} extraProps={service} />
			<ServiceDetailsModal isOpen={detailsModal} onClose={() => setDetailsModal(false)} extraProps={service} />
		</div>
	);
}

export default Page;