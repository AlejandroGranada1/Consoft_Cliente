'use client';
import { Pencil, Eye, Trash2, Search, Plus, Wrench } from 'lucide-react';
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
			background: '#1e1e1c',
			color: '#fff',
			showCancelButton: true,
			confirmButtonColor: '#8B5E3C',
			cancelButtonColor: '#4a4a4a',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		});

		if (!result.isConfirmed) return;

		try {
			await deleteService.mutateAsync(serviceToDelete._id!);
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Servicio eliminado correctamente',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});
		} catch {
			Swal.fire({
				title: 'Error',
				text: 'No se pudo eliminar el servicio',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		}
	};

	return (
		<div
			className="w-full relative px-4 md:px-20 py-10 min-h-full"
			style={{
				background: `
					radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
					radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
					linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
				`,
			}}
		>
			{/* Grain effect */}
			<div
				className="absolute inset-0 pointer-events-none opacity-[0.045]"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					backgroundSize: '180px 180px',
				}}
			/>
			<div
				className="absolute inset-0 pointer-events-none"
				style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
			/>

			<div className="relative z-10 flex flex-col min-h-full">
				{/* Header */}
				<header className="flex flex-col gap-4 mb-8">
					<div>
						<span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">
							Servicios
						</span>
						<h1 className="font-serif text-white text-3xl md:text-4xl mt-2 flex items-center gap-3">
							<Wrench size={32} className="text-[#C8A882]" />
							Gestión de Servicios
						</h1>
					</div>

					{/* Filtros y botón */}
					<div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
						<div className="relative w-full md:w-80">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
							<input
								type="text"
								placeholder="Buscar por nombre o descripción..."
								value={filterText}
								onChange={(e) => setFilterText(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-xl
									border border-white/15 bg-white/5
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
							/>
						</div>

						<button
							onClick={() => setCreateModal(true)}
							className="inline-flex items-center justify-center gap-2
								px-6 py-3 rounded-xl
								bg-[#8B5E3C] hover:bg-[#6F452A]
								text-white text-sm font-medium
								shadow-lg shadow-[#8B5E3C]/20
								transition-all duration-200
								w-full md:w-auto"
						>
							<Plus size={18} />
							Nuevo Servicio
						</button>
					</div>
				</header>

				{/* Tabla */}
				<section className="w-full mx-auto flex-1 flex flex-col">
					{/* Encabezado tabla - solo desktop */}
					<div className="hidden md:grid grid-cols-4 place-items-center py-4 px-4
						border-b border-white/10 text-[11px] tracking-[.08em] uppercase text-white/40 font-medium">
						<p>Servicio</p>
						<p>Descripción</p>
						<p>Estado</p>
						<p>Acciones</p>
					</div>

					{/* Lista de servicios */}
					<div className="space-y-2 mt-4 flex-1">
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
							<div className="text-center py-16 px-4
								rounded-2xl border border-white/10
								bg-white/5 backdrop-blur-sm">
								<Wrench size={40} className="mx-auto text-white/20 mb-3" />
								<p className="text-white/60 text-sm">No hay servicios para mostrar</p>
								<p className="text-white/30 text-xs mt-1">Crea un nuevo servicio para comenzar</p>
							</div>
						)}
					</div>

					{/* Paginación */}
					{totalPages > 1 && (
						<div className="mt-8 pt-4 border-t border-white/10">
							<Pagination
								count={totalPages}
								page={currentPage}
								onChange={(_, newPage) => setCurrentPage(newPage)}
								className=""
							/>
						</div>
					)}

					{/* Espaciador inferior */}
					<div className="h-8 md:h-12" />
				</section>

				{/* Modales */}
				<CreateServiceModal isOpen={createModal} onClose={() => setCreateModal(false)} />
				<EditServiceModal isOpen={editModal} onClose={() => setEditModal(false)} extraProps={service} />
				<ServiceDetailsModal isOpen={detailsModal} onClose={() => setDetailsModal(false)} extraProps={service} />
			</div>
		</div>
	);
}

export default Page;