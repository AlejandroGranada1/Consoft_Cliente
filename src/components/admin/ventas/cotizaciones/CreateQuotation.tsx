'use client';
import { 
	X, 
	ImagePlus, 
	Package, 
	User, 
	FileText, 
	Plus, 
	Minus, 
	Search,
	Check,
	AlertCircle,
	Save,
	Ruler,
	Palette
} from 'lucide-react';
import { useGetUsers, useGetProducts } from '@/hooks/apiHooks';
import { DefaultModalProps } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '@/components/Global/axios';

const initialItem = () => ({
	tempId: crypto.randomUUID(),
	isCustom: false,
	productId: '',
	quantity: 1,
	color: '',
	size: '',
	price: 0,
	name: '',
	notes: '',
	imageFile: null as File | null,
	imagePreview: '',
});

function CreateQuotationModal({ isOpen, onClose, updateList }: DefaultModalProps) {
	const [userName, setUserName] = useState('');
	const [selectedUser, setSelectedUser] = useState<any>(null);
	const [adminNotes, setAdminNotes] = useState('');
	const [items, setItems] = useState([initialItem()]);
	const [isPending, setIsPending] = useState(false);

	const { data: usersData } = useGetUsers();
	const { data: productsData } = useGetProducts();

	const users = usersData?.users || [];
	const products = productsData || [];

	useEffect(() => {
		if (!isOpen) {
			setUserName('');
			setSelectedUser(null);
			setAdminNotes('');
			setItems([initialItem()]);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const updateItem = (tempId: string, field: string, value: any) =>
		setItems((prev) => prev.map((i) => (i.tempId === tempId ? { ...i, [field]: value } : i)));

	const handleImageChange = (tempId: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		updateItem(tempId, 'imageFile', file);
		updateItem(tempId, 'imagePreview', URL.createObjectURL(file));
	};

	const toggleCustom = (tempId: string, isCustom: boolean) =>
		setItems((prev) =>
			prev.map((i) => (i.tempId === tempId ? { ...initialItem(), tempId, isCustom } : i)),
		);

	const addItem = () => setItems((prev) => [...prev, initialItem()]);
	const removeItem = (tempId: string) =>
		setItems((prev) => prev.filter((i) => i.tempId !== tempId));

	const totalEstimate = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

	const handleSave = async () => {
		if (!selectedUser) {
			return Swal.fire({
				title: 'Cliente requerido',
				text: 'Selecciona un cliente para la cotización',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		for (const item of items) {
			if (item.isCustom && !item.name.trim()) {
				return Swal.fire({
					title: 'Nombre requerido',
					text: 'Los productos personalizados deben tener un nombre',
					icon: 'warning',
					background: '#1e1e1c',
					color: '#fff',
				});
			}
			if (!item.isCustom && !item.productId) {
				return Swal.fire({
					title: 'Producto requerido',
					text: 'Selecciona un producto del catálogo',
					icon: 'warning',
					background: '#1e1e1c',
					color: '#fff',
				});
			}
			if (!item.color.trim()) {
				return Swal.fire({
					title: 'Color requerido',
					text: 'Todos los productos deben tener un color',
					icon: 'warning',
					background: '#1e1e1c',
					color: '#fff',
				});
			}
			if (item.quantity < 1) {
				return Swal.fire({
					title: 'Cantidad inválida',
					text: 'La cantidad debe ser al menos 1',
					icon: 'warning',
					background: '#1e1e1c',
					color: '#fff',
				});
			}
		}

		setIsPending(true);

		try {
			// Paso 1: crear cotización vacía
			const { data } = await api.post('/api/quotations/admin/create', {
				userId: selectedUser._id,
				adminNotes,
			});

			const quotationId = data.quotation._id;

			// Paso 2: agregar items uno por uno
			for (const item of items) {
				if (item.isCustom) {
					const fd = new FormData();
					fd.append('name', item.name);
					fd.append('description', item.notes || item.name);
					fd.append('color', item.color);
					fd.append('size', item.size || '');
					fd.append('quantity', String(item.quantity));
					fd.append('quotationId', quotationId);
					if (item.imageFile) fd.append('referenceImage', item.imageFile);

					await api.post('/api/quotations/cart/custom', fd);
				} else {
					await api.post(`/api/quotations/${quotationId}/items`, {
						productId: item.productId,
						quantity: item.quantity,
						color: item.color,
						size: item.size || '',
					});
				}
			}

			// Paso 3: si hay precios definidos, settear la cotización
			if (totalEstimate > 0) {
				const { data: updated } = await api.get(`/api/quotations/${quotationId}`);
				const quotationItems = updated.quotation.items;

				await api.post(`/api/quotations/${quotationId}/quote`, {
					totalEstimate,
					adminNotes,
					items: quotationItems.map((qi: any, idx: number) => ({
						_id: qi._id,
						price: items[idx]?.price || 0,
					})),
				});
			}

			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Cotización creada exitosamente',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});
			if (updateList) updateList();
			onClose();
		} catch (err: any) {
			console.error(err);
			Swal.fire({
				title: 'Error',
				text: err?.response?.data?.message || 'No se pudo crear la cotización',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		} finally {
			setIsPending(false);
		}
	};
	
	const filteredUsers = users.filter(
		(u: any) =>
			u.name?.toLowerCase().includes(userName.toLowerCase()) ||
			u.email?.toLowerCase().includes(userName.toLowerCase()),
	);

	const formatCurrency = (value: number) => {
		return `$${value.toLocaleString('es-CO')}`;
	};

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
						<FileText size={18} className="text-[#C8A882]" />
						Nueva Cotización
					</h2>
				</header>

				{/* Body */}
				<div className="overflow-y-auto flex-1 p-6 space-y-6">
					
					{/* Cliente */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
							<User size={16} className="text-[#C8A882]" />
							Cliente
						</h3>
						<div className="space-y-2">
							<div className="relative">
								<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
								<input
									type="text"
									placeholder="Buscar por nombre o correo..."
									value={
										selectedUser
											? `${selectedUser.name} (${selectedUser.email})`
											: userName
									}
									onChange={(e) => {
										setUserName(e.target.value);
										setSelectedUser(null);
									}}
									className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-4 py-3
										text-sm text-white placeholder:text-white/30
										focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
										transition-all duration-200"
								/>
							</div>
							
							{!selectedUser && userName && filteredUsers.length > 0 && (
								<div className="rounded-xl border border-white/10 bg-white/5 shadow-lg max-h-36 overflow-y-auto">
									{filteredUsers.slice(0, 6).map((u: any) => (
										<button
											key={u._id}
											type="button"
											onClick={() => {
												setSelectedUser(u);
												setUserName('');
											}}
											className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/8 transition border-b border-white/10 last:border-none flex items-center justify-between">
											<div>
												<span className="font-medium text-white">{u.name}</span>
												<span className="text-white/40 ml-2 text-xs">
													{u.email}
												</span>
											</div>
											<Check size={14} className="text-[#C8A882]" />
										</button>
									))}
								</div>
							)}
							
							{selectedUser && (
								<div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3">
									<div>
										<p className="text-sm font-medium text-white">
											{selectedUser.name}
										</p>
										<p className="text-xs text-white/40">{selectedUser.email}</p>
									</div>
									<button
										type="button"
										onClick={() => setSelectedUser(null)}
										className="p-1 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition">
										<X size={14} />
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Items */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-sm font-medium text-white flex items-center gap-2">
								<Package size={16} className="text-[#C8A882]" />
								Productos ({items.length})
							</h3>
							<button
								type="button"
								onClick={addItem}
								className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
									border border-[#C8A882]/30 bg-[#C8A882]/10
									text-[#C8A882] text-xs font-medium
									hover:bg-[#C8A882]/20 hover:border-[#C8A882]/50
									transition-all duration-200">
								<Plus size={14} />
								Agregar producto
							</button>
						</div>

						<div className="space-y-4 max-h-80 overflow-y-auto pr-2">
							{items.map((item, idx) => (
								<div
									key={item.tempId}
									className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
									
									{/* Item header */}
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-white/70">
											Producto {idx + 1}
										</span>
										<div className="flex items-center gap-3">
											<label className="flex items-center gap-2 text-sm cursor-pointer">
												<span className="text-white/40">Personalizado</span>
												<button
													type="button"
													onClick={() => toggleCustom(item.tempId, !item.isCustom)}
													className={`relative w-9 h-5 rounded-full transition-colors ${item.isCustom ? 'bg-[#8B5E3C]' : 'bg-white/20'}`}>
													<span
														className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.isCustom ? 'translate-x-4' : ''}`}
													/>
												</button>
											</label>
											{items.length > 1 && (
												<button
													type="button"
													onClick={() => removeItem(item.tempId)}
													className="p-1 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition">
													<Minus size={14} />
												</button>
											)}
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3">
										{/* PRODUCTO NORMAL */}
										{!item.isCustom && (
											<div className="col-span-2 space-y-2">
												<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
													Producto del catálogo *
												</label>
												<select
													value={item.productId}
													onChange={(e) =>
														updateItem(item.tempId, 'productId', e.target.value)
													}
													className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2
														text-sm text-white
														focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
														transition-all duration-200 appearance-none">
													<option value="" className="bg-[#1e1e1c]">Seleccionar producto...</option>
													{products.map((p: any) => (
														<option key={p._id} value={p._id} className="bg-[#1e1e1c]">
															{p.name}
														</option>
													))}
												</select>
											</div>
										)}

										{/* PRODUCTO CUSTOM */}
										{item.isCustom && (
											<>
												<div className="col-span-2 space-y-2">
													<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
														Nombre del mueble *
													</label>
													<input
														type="text"
														placeholder="Ej: Mesa de comedor rústica"
														value={item.name}
														onChange={(e) => updateItem(item.tempId, 'name', e.target.value)}
														className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2
															text-sm text-white placeholder:text-white/30
															focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
															transition-all duration-200"
													/>
												</div>

												<div className="col-span-2 space-y-2">
													<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
														Notas / descripción
													</label>
													<textarea
														rows={2}
														placeholder="Describe el mueble, materiales, estilo..."
														value={item.notes}
														onChange={(e) => updateItem(item.tempId, 'notes', e.target.value)}
														className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2
															text-sm text-white placeholder:text-white/30
															focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
															transition-all duration-200 resize-none"
													/>
												</div>

												<div className="col-span-2 space-y-2">
													<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
														Imagen de referencia
													</label>
													<label className="flex items-center gap-2 border border-dashed border-white/15 rounded-xl px-4 py-3 cursor-pointer hover:border-[#C8A882]/50 transition">
														<ImagePlus size={16} className="text-white/40" />
														<span className="text-sm text-white/60 truncate">
															{item.imageFile ? item.imageFile.name : 'Seleccionar imagen'}
														</span>
														<input
															type="file"
															accept="image/*"
															className="hidden"
															onChange={(e) => handleImageChange(item.tempId, e)}
														/>
													</label>
													{item.imagePreview && (
														<img
															src={item.imagePreview}
															alt="Preview"
															className="mt-2 h-24 object-contain rounded-lg border border-white/10"
														/>
													)}
												</div>
											</>
										)}

										{/* CAMPOS COMUNES */}
										<div className="space-y-2">
											<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
												Cantidad *
											</label>
											<input
												type="number"
												min={1}
												value={item.quantity}
												onChange={(e) => updateItem(item.tempId, 'quantity', Number(e.target.value))}
												className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2
													text-sm text-white
													focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
													transition-all duration-200"
											/>
										</div>

										<div className="space-y-2">
											<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
												Precio unitario
											</label>
											<div className="relative">
												<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
													$
												</span>
												<input
													type="number"
													min={0}
													value={item.price}
													onChange={(e) => updateItem(item.tempId, 'price', Number(e.target.value))}
													className="w-full rounded-xl border border-white/15 bg-white/5 pl-6 pr-4 py-2
														text-sm text-white
														focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
														transition-all duration-200"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
												Color *
											</label>
											<input
												type="text"
												placeholder="Ej: Nogal"
												value={item.color}
												onChange={(e) => updateItem(item.tempId, 'color', e.target.value)}
												className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2
													text-sm text-white placeholder:text-white/30
													focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
													transition-all duration-200"
											/>
										</div>

										<div className="space-y-2">
											<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
												Tamaño / Dimensiones
											</label>
											<input
												type="text"
												placeholder="Ej: 120x80x75cm"
												value={item.size}
												onChange={(e) => updateItem(item.tempId, 'size', e.target.value)}
												className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2
													text-sm text-white placeholder:text-white/30
													focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
													transition-all duration-200"
											/>
										</div>

										<div className="col-span-2 flex justify-end pt-2 border-t border-white/10">
											<span className="text-sm text-white/60">
												Subtotal:{' '}
												<span className="font-semibold text-[#C8A882]">
													{formatCurrency(item.price * item.quantity)}
												</span>
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Notas generales */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
							<FileText size={16} className="text-[#C8A882]" />
							Notas generales
						</h3>
						<textarea
							rows={3}
							placeholder="Observaciones generales de la cotización..."
							value={adminNotes}
							onChange={(e) => setAdminNotes(e.target.value)}
							className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white placeholder:text-white/30
								focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
								transition-all duration-200 resize-none"
						/>
					</div>

					{/* Resumen */}
					{totalEstimate > 0 && (
						<div className="p-4 rounded-xl border border-white/10 bg-white/5">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-white">Total estimado</p>
									<p className="text-xs text-white/40 mt-1">
										{items.length} {items.length === 1 ? 'producto' : 'productos'}
									</p>
								</div>
								<div className="text-right">
									<span className="text-2xl font-bold text-[#C8A882]">
										{formatCurrency(totalEstimate)}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 px-6 py-4 border-t border-white/10 flex justify-end gap-3"
					style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
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
						type="button"
						onClick={handleSave}
						disabled={isPending || !selectedUser}
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
								Guardando...
							</>
						) : (
							<>
								<Save size={14} />
								Crear cotización
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateQuotationModal;