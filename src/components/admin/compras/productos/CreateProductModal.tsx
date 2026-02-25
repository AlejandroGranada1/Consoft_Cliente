'use client';
import { 
	X, 
	Package, 
	Tag, 
	FileText, 
	ImagePlus, 
	FolderTree, 
	ToggleLeft, 
	Save,
	Eye,
	AlertCircle 
} from 'lucide-react';
import { DefaultModalProps, Category, Product } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '@/components/Global/axios';
import { createElement } from '../../global/alerts';

const initialState = {
	_id: undefined,
	name: '',
	description: '',
	category: {
		_id: '',
		name: '',
		description: '',
		products: [],
	},
	imageUrl: '',
	imageFile: null as File | null,
	status: true,
};

function CreateProductModal({
	isOpen,
	onClose,
	updateList,
}: DefaultModalProps<Product> & { updateList?: () => void }) {
	const [formData, setFormData] = useState<any>(initialState);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isPending, setIsPending] = useState(false);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			setIsLoadingCategories(true);
			try {
				const res = await api.get('/api/categories');
				setCategories(res.data.categories);
			} catch (err) {
				console.error('Error al cargar categorías', err);
				Swal.fire({
					title: 'Error',
					text: 'No se pudieron cargar las categorías',
					icon: 'error',
					background: '#1e1e1c',
					color: '#fff',
				});
			} finally {
				setIsLoadingCategories(false);
			}
		};

		if (isOpen) fetchCategories();
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			setFormData(initialState);
			setIsPending(false);
		}
	}, [isOpen]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		if (name === 'category') {
			const selected = categories.find((c) => c._id === value);
			if (selected) {
				setFormData((prev: any) => ({ ...prev, category: selected }));
			}
			return;
		}

		setFormData((prev: any) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev: any) => ({
				...prev,
				imageFile: file,
				imageUrl: URL.createObjectURL(file),
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim() || !formData.description.trim()) {
			return Swal.fire({
				title: 'Campos incompletos',
				text: 'Nombre y descripción son obligatorios',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		if (!formData.category?._id) {
			return Swal.fire({
				title: 'Categoría requerida',
				text: 'Debe seleccionar una categoría',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		if (!formData.imageFile) {
			return Swal.fire({
				title: 'Imagen requerida',
				text: 'Debe seleccionar una imagen para el producto',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		setIsPending(true);

		try {
			const fd = new FormData();
			fd.append('name', formData.name);
			fd.append('description', formData.description);
			fd.append('category', formData.category._id);
			fd.append('status', String(formData.status));
			fd.append('image', formData.imageFile);

			const confirm = await createElement(
				'Producto',
				'/api/products',
				fd,
				updateList
			);

			if (confirm) {
				Swal.fire({
					toast: true,
					animation: false,
					timerProgressBar: true,
					showConfirmButton: false,
					title: 'Producto creado exitosamente',
					icon: 'success',
					position: 'top-right',
					timer: 1500,
					background: '#1e1e1c',
					color: '#fff',
				});
				
				updateList && updateList();
				onClose();
				setFormData(initialState);
			}
		} catch (err) {
			console.error('Error al crear producto', err);
			Swal.fire({
				title: 'Error',
				text: 'No se pudo crear el producto',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		} finally {
			setIsPending(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed top-18 left-72 inset-0 z-50 flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
			
			<div className="w-full max-w-3xl rounded-2xl border border-white/10
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
						<Package size={18} className="text-[#C8A882]" />
						Crear nuevo producto
					</h2>
				</header>

				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 p-6 overflow-y-auto">
					
					{/* Columna izquierda - Formulario */}
					<div className="space-y-5">
						
						{/* Nombre */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Nombre del producto *
							</label>
							<input
								name="name"
								type="text"
								placeholder="Ej: Mesa de comedor"
								value={formData.name}
								onChange={handleChange}
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
								required
							/>
						</div>

						{/* Categoría */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Categoría *
							</label>
							<select
								name="category"
								value={formData.category?._id || ''}
								onChange={handleChange}
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200 appearance-none"
								disabled={isLoadingCategories}
								required>
								<option value="" className="bg-[#1e1e1c]">
									{isLoadingCategories ? 'Cargando...' : 'Seleccione una categoría'}
								</option>
								{categories.map((c) => (
									<option key={c._id} value={c._id} className="bg-[#1e1e1c]">
										{c.name}
									</option>
								))}
							</select>
						</div>

						{/* Descripción */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Descripción *
							</label>
							<input
								name="description"
								type="text"
								placeholder="Descripción del producto"
								value={formData.description}
								onChange={handleChange}
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
								required
							/>
						</div>

						{/* Imagen */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Imagen del producto *
							</label>
							<label className="flex items-center gap-3 border border-dashed border-white/15 rounded-xl px-4 py-3 cursor-pointer hover:border-[#C8A882]/50 transition bg-white/5">
								<ImagePlus size={18} className="text-white/40" />
								<span className="text-sm text-white/60 truncate">
									{formData.imageFile ? formData.imageFile.name : 'Seleccionar imagen (JPG, PNG)'}
								</span>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>
							</label>
							{!formData.imageFile && (
								<p className="text-xs text-yellow-400/70 mt-2 flex items-center gap-1">
									<AlertCircle size={12} />
									La imagen es obligatoria
								</p>
							)}
						</div>

						{/* Estado */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Estado
							</label>
							<button
								type="button"
								onClick={() => setFormData((prev: any) => ({ ...prev, status: !prev.status }))}
								className="flex items-center gap-3">
								<div className={`relative w-11 h-6 rounded-full transition-colors ${formData.status ? 'bg-green-500/50' : 'bg-white/20'}`}>
									<span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.status ? 'translate-x-5' : ''}`} />
								</div>
								<span className={`text-sm font-medium ${formData.status ? 'text-green-400' : 'text-white/40'}`}>
									{formData.status ? 'Activo' : 'Inactivo'}
								</span>
							</button>
							<p className="text-xs text-white/30 mt-2">
								Los productos inactivos no se muestran en el catálogo
							</p>
						</div>
					</div>

					{/* Columna derecha - Preview */}
					<div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-start">
						<h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2 self-start">
							<Eye size={16} className="text-[#C8A882]" />
							Vista previa
						</h3>
						
						{formData.imageUrl ? (
							<div className="w-full space-y-3">
								<div className="rounded-xl border border-white/10 overflow-hidden bg-white/5 p-2">
									<img
										src={formData.imageUrl}
										alt={formData.name}
										className="w-full max-h-64 object-contain rounded-lg"
									/>
								</div>
								<p className="text-xs text-white/30 text-center">
									{formData.name || 'Producto sin nombre'}
								</p>
								{formData.category?.name && (
									<p className="text-xs text-white/20 text-center">
										Categoría: {formData.category.name}
									</p>
								)}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-64 text-white/20 border-2 border-dashed border-white/10 rounded-xl w-full">
								<ImagePlus size={48} strokeWidth={1} />
								<p className="text-sm mt-2 text-white/30">Sin imagen</p>
								<p className="text-xs text-center mt-1 max-w-[200px] text-white/20">
									La imagen se mostrará aquí cuando la selecciones
								</p>
							</div>
						)}
					</div>

					{/* Botones - ocupan ambas columnas */}
					<div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-white/10">
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
							disabled={isPending || !formData.name.trim() || !formData.description.trim() || !formData.category?._id || !formData.imageFile}
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
									Crear Producto
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateProductModal;