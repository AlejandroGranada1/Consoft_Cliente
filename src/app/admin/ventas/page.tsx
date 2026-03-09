'use client';
import { Eye, Search, TrendingUp } from 'lucide-react';
import { Sale } from '@/lib/types';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import Pagination from '@/components/Global/Pagination';
import SaleRow from '@/components/admin/ventas/Ventas/SaleRow';
import SaleDetailsModal from '@/components/admin/ventas/Ventas/SaleDetailsModal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function SalesPage() {
	const [Item, setItem] = useState<Sale>();
	const [detailsModal, setDetailsModal] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const pageQuery = searchParams.get('page');
	const currentPage = pageQuery ? parseInt(pageQuery, 10) : 1;
	const itemsPerPage = 5;

	useEffect(() => {
		if (!searchParams.has('page')) {
			const params = new URLSearchParams(searchParams.toString());
			params.set('page', '1');
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		}
	}, [pathname, router, searchParams]);

	const initialSearch = searchParams.get('search') || '';
	const [filterText, setFilterText] = useState(initialSearch);
	const [appliedSearch, setAppliedSearch] = useState(initialSearch);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (appliedSearch !== filterText) {
				setAppliedSearch(filterText);
				const params = new URLSearchParams(searchParams.toString());
				params.set('page', '1');
				if (filterText) {
					params.set('search', filterText);
				} else {
					params.delete('search');
				}
				router.push(`${pathname}?${params.toString()}`, { scroll: false });
			}
		}, 400);
		return () => clearTimeout(timeout);
	}, [filterText, appliedSearch, pathname, router, searchParams]);

	const [data, setData] = useState<{ sales: Sale[]; pagination: { pages: number } }>({ sales: [], pagination: { pages: 0 } });

	const fetchSales = async () => {
		try {
			const queryParams = new URLSearchParams({
				page: String(currentPage),
				limit: String(itemsPerPage),
			});
			if (appliedSearch) queryParams.append('search', appliedSearch);

			const response = await api.get(`/api/sales?${queryParams.toString()}`);
			setData(response.data);
		} catch (error) {
			console.error("Error fetching sales:", error);
			setData({ sales: [], pagination: { pages: 0 } });
		}
	};

	useEffect(() => {
		fetchSales();
	}, [currentPage, appliedSearch]);

	const currentSales = data.sales || [];
	const totalPages = data.pagination?.pages || 0;

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
							<TrendingUp size={32} className="text-[#C8A882]" />
							Gestión de Ventas
						</h1>
					</div>

					{/* Buscador */}
					<div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
						<div className="relative w-full md:w-80">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
							<input
								type="text"
								placeholder="Buscar por ID de venta o cliente..."
								value={filterText}
								onChange={(e) => setFilterText(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-xl
									border border-white/15 bg-white/5
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
							/>
						</div>
					</div>
				</header>

				{/* Tabla */}
				<section className="w-full mx-auto flex-1 flex flex-col">
					{/* Encabezado tabla - solo desktop */}
					<div className="hidden md:grid grid-cols-7 place-items-center py-4 px-4
						border-b border-white/10 text-[11px] tracking-[.08em] uppercase text-white/40 font-medium">
						<p>ID Venta</p>
						<p>Cliente</p>
						<p>Total</p>
						<p>Pagado</p>
						<p>Estado del pago</p>
						<p>Estado del pedido</p>
						<p>Acciones</p>
					</div>

					{/* Lista de ventas */}
					<div className="space-y-2 mt-4 flex-1">
						{currentSales.length > 0 ? (
							currentSales.map((sale) => (
								<SaleRow
									key={sale.order._id}
									sale={sale}
									onView={() => {
										setDetailsModal(true);
										setItem(sale);
									}}
								/>
							))
						) : (
							<div className="text-center py-16 px-4
								rounded-2xl border border-white/10
								bg-white/5 backdrop-blur-sm">
								<TrendingUp size={40} className="mx-auto text-white/20 mb-3" />
								<p className="text-white/60 text-sm">No hay ventas para mostrar</p>
								<p className="text-white/30 text-xs mt-1">Las ventas aparecerán aquí cuando se realicen</p>
							</div>
						)}
					</div>

					{/* Paginación */}
					{totalPages > 1 && (
						<div className="mt-8 pt-4 border-t border-white/10">
							<Pagination
								count={totalPages}
								page={currentPage}
								onChange={(_, newPage) => {
									const params = new URLSearchParams(searchParams.toString());
									params.set('page', newPage.toString());
									router.push(`${pathname}?${params.toString()}`, { scroll: false });
								}}
								className=""
							/>
						</div>
					)}

					{/* Espaciador inferior */}
					<div className="h-8 md:h-12" />
				</section>
			</div>

			<SaleDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={Item}
				updateList={fetchSales}
			/>
		</div>
	);
}

export default SalesPage;