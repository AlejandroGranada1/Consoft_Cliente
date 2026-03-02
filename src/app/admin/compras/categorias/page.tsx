'use client';
import { Search, Plus, Layers } from 'lucide-react';
import { Category } from '@/lib/types';
import CategoryDetailsModal from '@/components/admin/compras/categorias/CategoryDetailsModal';
import CreateCategoryModal from '@/components/admin/compras/categorias/CreateCategoryModal';
import EditCategoryModal from '@/components/admin/compras/categorias/EditCategoryModal';
import { deleteElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import CategoryRow from '@/components/admin/compras/categorias/CategoryRow';
import Pagination from '@/components/Global/Pagination';

function Page() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [category, setCategory] = useState<Category>();
	const [filter, setFilter] = useState('');

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const fetchCategories = async () => {
		try {
			setLoading(true);
			const response = await api.get('/api/categories');
			setCategories(response.data.categories);
		} catch (error) {
			console.error('Error al obtener categorías', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const filteredCategories = categories.filter(
		(c) =>
			c.name.toLowerCase().includes(filter.toLowerCase()) ||
			c.description?.toLowerCase().includes(filter.toLowerCase())
	);

	const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentCategories = filteredCategories.slice(startIndex, endIndex);

	useEffect(() => {
		setCurrentPage(1);
	}, [filter]);

	const handleDeleteCategory = (categoryId: string) => {
		deleteElement('Categoría', `/api/categories/${categoryId}`, fetchCategories);
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
							Compras
						</span>
						<h1 className="font-serif text-white text-3xl md:text-4xl mt-2 flex items-center gap-3">
							<Layers size={32} className="text-[#C8A882]" />
							Gestión de Categorías
						</h1>
					</div>

					{/* Filtros y botón */}
					<div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
						<div className="relative w-full md:w-80">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
							<input
								type="text"
								placeholder="Buscar por nombre o descripción..."
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
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
							Nueva Categoría
						</button>
					</div>
				</header>

				{/* Tabla */}
				<section className="w-full mx-auto flex-1 flex flex-col">
					{/* Encabezado desktop */}
					<div className="hidden md:grid grid-cols-4 place-items-center py-4 px-4
						border-b border-white/10 text-[11px] tracking-[.08em] uppercase text-white/40 font-medium">
						<p>Categoría</p>
						<p>Descripción</p>
						<p>Productos</p>
						<p>Acciones</p>
					</div>

					{/* Listado */}
					<div className="space-y-2 mt-4 flex-1">
						{loading ? (
							<div className="text-center py-8 text-white/40">Cargando categorías...</div>
						) : currentCategories.length > 0 ? (
							currentCategories.map((cat) => (
								<CategoryRow
									key={cat._id}
									category={cat}
									onView={() => {
										setDetailsModal(true);
										setCategory(cat);
									}}
									onEdit={() => {
										setEditModal(true);
										setCategory(cat);
									}}
									onDelete={() => handleDeleteCategory(cat._id!)}
								/>
							))
						) : (
							<div className="text-center py-16 px-4
								rounded-2xl border border-white/10
								bg-white/5 backdrop-blur-sm">
								<Layers size={40} className="mx-auto text-white/20 mb-3" />
								<p className="text-white/60 text-sm">No hay categorías para mostrar</p>
								<p className="text-white/30 text-xs mt-1">Crea una nueva categoría para comenzar</p>
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
				<CreateCategoryModal
					isOpen={createModal}
					onClose={() => setCreateModal(false)}
					updateList={fetchCategories}
				/>
				<CategoryDetailsModal
					isOpen={detailsModal}
					onClose={() => setDetailsModal(false)}
					extraProps={category}
					updateList={fetchCategories}
				/>
				<EditCategoryModal
					isOpen={editModal}
					onClose={() => setEditModal(false)}
					extraProps={category}
					updateList={fetchCategories}
				/>
			</div>
		</div>
	);
}

export default Page;