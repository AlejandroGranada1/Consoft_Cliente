'use client';
import { X, Tag, FileText, Save, Layers, AlertCircle } from 'lucide-react';
import { DefaultModalProps, Category } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createElement } from '../../global/alerts';
import { createPortal } from 'react-dom';

const initialState: Omit<Category, 'id'> = {
	name: '',
	description: '',
	products: [],
	_id: undefined,
};

function CreateCategoryModal({ isOpen, onClose, updateList }: DefaultModalProps<Category>) {
	const [categoryData, setCategoryData] = useState<Omit<Category, 'id'>>(initialState);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setCategoryData(initialState);
			setIsPending(false);
		}
	}, [isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCategoryData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!categoryData.name.trim() || !categoryData.description?.trim()) {
			return Swal.fire({
				title: 'Campos incompletos',
				text: 'Nombre y descripción son obligatorios',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		setIsPending(true);

		try {
			const confirm = await createElement(
				'categoría',
				'/api/categories',
				categoryData,
				updateList
			);

			if (confirm) {
				Swal.fire({
					toast: true,
					animation: false,
					timerProgressBar: true,
					showConfirmButton: false,
					title: 'Categoría creada exitosamente',
					icon: 'success',
					position: 'top-right',
					timer: 1500,
					background: '#1e1e1c',
					color: '#fff',
				});
				
				if (updateList) await updateList();
				onClose();
				setCategoryData(initialState);
			}
		} catch (error) {
			console.error('Error al crear categoría:', error);
			Swal.fire({
				title: 'Error',
				text: 'No se pudo crear la categoría',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		} finally {
			setIsPending(false);
		}
	};

	if (!isOpen) return null;

	return createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
			
			<div className="w-full max-w-[600px] rounded-2xl border border-white/10
				shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
				style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
				
				{/* Header */}
				<header className="relative px-6 py-5 border-b border-white/10">
					<button
						onClick={onClose}
						className="absolute right-4 top-1/2 -translate-y-1/2
							p-2 rounded-lg text-white/40 hover:text-white/70
							hover:bg-white/5 transition-all duration-200">
						<X size={18} />
					</button>
					<h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
						<Layers size={18} className="text-[#C8A882]" />
						Crear nueva categoría
					</h2>
				</header>

				<form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">

					{/* Nombre */}
					<div className="space-y-2">
						<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
							Nombre de la categoría *
						</label>
						<input
							name="name"
							type="text"
							placeholder="Ej: Muebles de sala"
							value={categoryData.name}
							onChange={handleChange}
							className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white placeholder:text-white/30
								focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
								transition-all duration-200"
							required
						/>
					</div>

					{/* Descripción */}
					<div className="space-y-2">
						<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
							Descripción *
						</label>
						<input
							name="description"
							type="text"
							placeholder="Breve descripción de la categoría"
							value={categoryData.description}
							onChange={handleChange}
							className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white placeholder:text-white/30
								focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
								transition-all duration-200"
							required
						/>
					</div>

					{/* Información adicional */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
							<Layers size={16} className="text-[#C8A882]" />
							Información
						</h3>
						<div className="rounded-lg bg-white/5 p-3">
							<p className="text-xs text-white/60 flex items-center gap-2">
								<AlertCircle size={14} className="text-white/40" />
								Los productos se pueden asignar a esta categoría después de crearla
							</p>
						</div>
					</div>

					{/* Resumen */}
					{categoryData.name && categoryData.description && (
						<div className="p-4 rounded-xl border border-white/10 bg-white/5">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-xs font-medium text-white/70">Resumen</p>
									<p className="text-xs text-white/40 mt-1">
										{categoryData.name}
									</p>
									<p className="text-xs text-white/40">
										{categoryData.description.substring(0, 50)}
										{categoryData.description.length > 50 ? '...' : ''}
									</p>
								</div>
								<div className="text-right">
									<span className="text-[10px] px-2 py-1 rounded-full
										bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20">
										Nueva categoría
									</span>
								</div>
							</div>
						</div>
					)}

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
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isPending || !categoryData.name.trim() || !categoryData.description?.trim()}
							className="px-5 py-2.5 rounded-lg
								bg-[#8B5E3C] hover:bg-[#6F452A]
								text-white text-sm font-medium
								shadow-lg shadow-[#8B5E3C]/20
								disabled:opacity-50 disabled:cursor-not-allowed
								flex items-center gap-2
								transition-all duration-200">
							{isPending ? (
								<>
									<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
									Creando...
								</>
							) : (
								<>
									<Save size={14} />
									Crear Categoría
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body
	);
}

export default CreateCategoryModal;