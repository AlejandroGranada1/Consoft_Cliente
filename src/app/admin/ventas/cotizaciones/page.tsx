'use client';
import { Search, Plus, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useGetAllCarts } from '@/hooks/apiHooks';
import QuotationModal from '@/components/admin/ventas/cotizaciones/QuotationModal';
import Pagination from '@/components/Global/Pagination';
import QuotationRow from '@/components/admin/ventas/cotizaciones/QuotationRow';
import { Quotation } from '@/lib/types';
import CreateQuotationModal from '@/components/admin/ventas/cotizaciones/CreateQuotation';

function Page() {
	const [detailsModal, setDetailsModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [selectedQuotation, setSelectedQuotation] = useState<Quotation>();
	const [filterText, setFilterText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const { data: quotations, refetch } = useGetAllCarts();

	const allQuotations = quotations?.quotations || [];

	// Filtrar solo estado SOLICITADA
	const statusFiltered = allQuotations.filter(
		(q: any) => q.status?.toLowerCase() === 'solicitada'
	);

	const filteredQuotations = statusFiltered.filter(
		(q: any) =>
			q._id?.toLowerCase().includes(filterText.toLowerCase()) ||
			q.user?.name?.toLowerCase().includes(filterText.toLowerCase())
	);

	const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentQuotations = filteredQuotations.slice(startIndex, endIndex);

	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

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
							Ventas
						</span>
						<h1 className="font-serif text-white text-3xl md:text-4xl mt-2 flex items-center gap-3">
							<FileText size={32} className="text-[#C8A882]" />
							Gestión de Cotizaciones
						</h1>
					</div>

					{/* Filtros y botón */}
					<div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
						<div className="relative w-full md:w-80">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
							<datalist id="orders">
								{statusFiltered.map((o: Quotation) => (
									<option key={o._id} value={o._id}></option>
								))}
							</datalist>
							<input
								type="text"
								list="orders"
								placeholder="Buscar por ID o cliente..."
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
							Crear Cotización
						</button>
					</div>
				</header>

				{/* Tabla */}
				<section className="w-full mx-auto flex-1 flex flex-col">
					{/* Encabezado tabla - solo desktop */}
					<div className="hidden md:grid grid-cols-5 place-items-center py-4 px-4
						border-b border-white/10 text-[11px] tracking-[.08em] uppercase text-white/40 font-medium">
						<p>Código</p>
						<p>Cliente</p>
						<p>Estado</p>
						<p>Items</p>
						<p>Acciones</p>
					</div>

					{/* Lista de cotizaciones */}
					<div className="space-y-2 mt-4 flex-1">
						{currentQuotations.length > 0 ? (
							currentQuotations.map((q: any) => (
								<QuotationRow
									key={q._id}
									q={q}
									onView={() => {
										setDetailsModal(true);
										setSelectedQuotation(q);
									}}
								/>
							))
						) : (
							<div className="text-center py-16 px-4
								rounded-2xl border border-white/10
								bg-white/5 backdrop-blur-sm">
								<FileText size={40} className="mx-auto text-white/20 mb-3" />
								<p className="text-white/60 text-sm">No hay cotizaciones solicitadas</p>
								<p className="text-white/30 text-xs mt-1">Crea una nueva cotización para comenzar</p>
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
				<QuotationModal
					isOpen={detailsModal}
					onClose={() => setDetailsModal(false)}
					extraProps={selectedQuotation}
				/>

				<CreateQuotationModal
					isOpen={createModal}
					onClose={() => setCreateModal(false)}
					updateList={refetch}
				/>
			</div>
		</div>
	);
}

export default Page;