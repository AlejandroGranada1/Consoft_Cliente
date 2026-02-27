'use client';
import { X, Tag, FileText, Package, Edit, Layers } from 'lucide-react';
import { DefaultModalProps, Category } from '@/lib/types';
import React, { useState } from 'react';
import EditCategoryModal from './EditCategoryModal';
import { createPortal } from 'react-dom';

function CategoryDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Category>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	return createPortal(
		<>
			<div
				className='fixed inset-0 z-50 flex items-center justify-center p-4'
				style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>

				<div className="w-full max-w-[600px] rounded-2xl border border-white/10
					shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
					style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>

					{/* Header */}
					<header className="relative px-6 py-5 border-b border-white/10">
						<div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
							<button
								onClick={() => setEditModal(true)}
								className="p-2 rounded-lg text-white/40 hover:text-[#C8A882]
									hover:bg-white/5 transition-all duration-200"
								title="Editar categoría">
								<Edit size={18} />
							</button>
							<button
								onClick={onClose}
								className="p-2 rounded-lg text-white/40 hover:text-white/70
									hover:bg-white/5 transition-all duration-200">
								<X size={18} />
							</button>
						</div>
						<h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
							<Layers size={18} className="text-[#C8A882]" />
							Detalles de categoría
						</h2>
					</header>

					<div className="p-6 overflow-y-auto space-y-5">

						{/* Nombre */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Nombre de la categoría
							</label>
							<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white/90 truncate">
								{extraProps.name}
							</div>
						</div>

						{/* Descripción */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Descripción
							</label>
							<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white/70 min-h-[60px] line-clamp-3 break-words whitespace-normal">
								{extraProps.description || 'Sin descripción'}
							</div>
						</div>

						{/* Productos asociados */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Productos asociados
							</label>
							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<div className="flex items-center justify-between mb-3">
									<span className="text-xs text-white/40">Cantidad de productos:</span>
									<span className="text-xl font-bold text-[#C8A882]">
										{extraProps.products?.length || 0}
									</span>
								</div>

								{extraProps.products && extraProps.products.length > 0 && (
									<>
										<div className="border-t border-white/10 my-3"></div>
										<div className="max-h-32 overflow-y-auto space-y-2 pr-2">
											{extraProps.products.map((product: any, idx: number) => (
												<div key={idx}
													className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/8 transition overflow-hidden">
													<Package size={14} className="text-white/40 shrink-0" />
													<span className="text-xs text-white/70 truncate">
														{product.name || `Producto ${idx + 1}`}
													</span>
												</div>
											))}
										</div>
									</>
								)}
							</div>
						</div>

						{/* Resumen */}
						<div className="p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
							<div className="flex justify-between items-center gap-4">
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-white truncate">Resumen</p>
									<p className="text-xs text-white/40 mt-1 truncate">
										{extraProps.name}
									</p>
								</div>
								<div className="text-right">
									<span className="text-xs px-3 py-1.5 rounded-full
										bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20">
										{extraProps.products?.length || 0} producto{(extraProps.products?.length || 0) !== 1 ? 's' : ''}
									</span>
								</div>
							</div>
						</div>

						{/* Botones */}
						<div className="flex justify-end gap-3 pt-4 border-t border-white/10">
							<button
								type="button"
								onClick={onClose}
								className="px-5 py-2.5 rounded-lg
									border border-white/15 bg-white/5
									text-white/70 text-sm
									hover:bg-white/10 hover:text-white
									transition-all duration-200">
								Cerrar
							</button>
							<button
								type="button"
								onClick={() => setEditModal(true)}
								className="px-5 py-2.5 rounded-lg
									border border-[#C8A882]/30 bg-[#C8A882]/10
									text-[#C8A882] text-sm font-medium
									hover:bg-[#C8A882]/20 hover:border-[#C8A882]/50
									flex items-center gap-2
									transition-all duration-200">
								<Edit size={14} />
								Editar Categoría
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<EditCategoryModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
				updateList={updateList}
			/>
		</>,
		document.body
	);
}

export default CategoryDetailsModal;