'use client';
import { Search, Plus } from 'lucide-react';
import { Visit } from '@/lib/types';
import CreateVisitModal from '@/components/admin/servicios/visitas/CreateVisitModal';
import VisitDetailsModal from '@/components/admin/servicios/visitas/VisitDetailsModal';
import React, { useState, useEffect } from 'react';
import api from '@/components/Global/axios';
import { deleteElement } from '@/components/admin/global/alerts';
import VisitRow from '@/components/admin/servicios/visitas/VisitRow';
import Pagination from '@/components/Global/Pagination';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [visits, setVisits] = useState<Visit[]>([]);

	console.log(visits)
	const [visit, setVisit] = useState<Visit>();
	const [filterText, setFilterText] = useState('');

	// Estados para paginación
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

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

	// Filtrar visitas
	const filteredVisits = visits.filter(
		(v) =>
			v._id?.toLowerCase().includes(filterText.toLowerCase()) ||
			v.user.name.toLowerCase().includes(filterText.toLowerCase()) ||
			v.status.toLowerCase().includes(filterText.toLowerCase())
	);

	// Cálculos de paginación
	const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentVisits = filteredVisits.slice(startIndex, endIndex);

	// Resetear a página 1 cuando cambia el filtro
	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

	// Función para eliminar visita
	const handleDeleteVisit = (visitId: string) => {
		deleteElement('Visita', `/api/visits/${visitId}`, fetchVisits);
	};

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE VISITAS
				</h1>

				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
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
						<Plus
							size={25}
							className='mr-2'
						/>{' '}
						Agregar Nueva Visita
					</button>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* Encabezado desktop */}
				<div className='hidden md:grid grid-cols-5 place-items-center py-6 font-semibold'>
					<p>ID de Visita</p>
					<p>Fecha</p>
					<p>Cliente</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* Listado con paginación */}
				{currentVisits.length > 0 ? (
					currentVisits.map((visitItem: Visit) => (
						<VisitRow
							key={visitItem._id}
							visit={visitItem}
							onView={() => {
								setDetailsModal(true);
								setVisit(visitItem);
							}}
							onDelete={() => handleDeleteVisit(visitItem._id!)}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>
						No hay visitas para mostrar
					</div>
				)}

				{/* Paginación */}
				{totalPages > 1 && (
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={(_, newPage) => setCurrentPage(newPage)}
						className='mt-6'
					/>
				)}
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
