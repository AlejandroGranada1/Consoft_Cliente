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
	Save
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
		if (!selectedUser)
			return Swal.fire(
				'Cliente requerido',
				'Selecciona un cliente para la cotización',
				'warning',
			);

		for (const item of items) {
			if (item.isCustom && !item.name.trim())
				return Swal.fire(
					'Nombre requerido',
					'Los productos personalizados deben tener un nombre',
					'warning',
				);
			if (!item.isCustom && !item.productId)
				return Swal.fire(
					'Producto requerido',
					'Selecciona un producto del catálogo',
					'warning',
				);
			if (!item.color.trim())
				return Swal.fire(
					'Color requerido',
					'Todos los productos deben tener un color',
					'warning',
				);
			if (item.quantity < 1)
				return Swal.fire('Cantidad inválida', 'La cantidad debe ser al menos 1', 'warning');
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
				icon: 'success',
				title: 'Cotización creada',
				timer: 1500,
				showConfirmButton: false,
			});
			if (updateList) updateList();
			onClose();
		} catch (err: any) {
			console.error(err);
			Swal.fire(
				'Error',
				err?.response?.data?.message || 'No se pudo crear la cotización',
				'error',
			);
		} finally {
			setIsPending(false);
		}
	};
	
	const filteredUsers = users.filter(
		(u: any) =>
			u.name?.toLowerCase().includes(userName.toLowerCase()) ||
			u.email?.toLowerCase().includes(userName.toLowerCase()),
	);

	const inputClass = 'w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown text-sm';

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-3xl flex flex-col max-h-[92vh]'>
				
				{/* Header */}
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<FileText size={20} /> Nueva Cotización
					</h1>
				</header>

				{/* Body */}
				<div className='overflow-y-auto flex-1 p-6 space-y-6'>
					
					{/* Cliente */}
					<div className='border rounded-lg p-4 bg-gray-50'>
						<h3 className='font-semibold mb-3 flex items-center gap-2'>
							<User size={16} />
							Cliente
						</h3>
						<div className='space-y-2'>
							<div className='relative'>
								<Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
								<input
									type='text'
									placeholder='Buscar por nombre o correo...'
									value={
										selectedUser
											? `${selectedUser.name} (${selectedUser.email})`
											: userName
									}
									onChange={(e) => {
										setUserName(e.target.value);
										setSelectedUser(null);
									}}
									className='w-full border px-3 py-2 pl-9 rounded-md focus:outline-none focus:ring-2 focus:ring-brown bg-white'
								/>
							</div>
							
							{!selectedUser && userName && filteredUsers.length > 0 && (
								<div className='border rounded-md bg-white shadow-sm max-h-36 overflow-y-auto'>
									{filteredUsers.slice(0, 6).map((u: any) => (
										<button
											key={u._id}
											type='button'
											onClick={() => {
												setSelectedUser(u);
												setUserName('');
											}}
											className='w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition border-b last:border-none flex items-center justify-between'>
											<div>
												<span className='font-medium text-gray-800'>{u.name}</span>
												<span className='text-gray-400 ml-2 text-xs'>
													{u.email}
												</span>
											</div>
											<Check size={14} className='text-brown opacity-0 group-hover:opacity-100' />
										</button>
									))}
								</div>
							)}
							
							{selectedUser && (
								<div className='flex items-center justify-between bg-white border rounded-md px-4 py-2.5'>
									<div>
										<p className='text-sm font-medium text-gray-800'>
											{selectedUser.name}
										</p>
										<p className='text-xs text-gray-500'>{selectedUser.email}</p>
									</div>
									<button
										type='button'
										onClick={() => setSelectedUser(null)}
										className='text-gray-400 hover:text-red-500 transition'>
										<X size={14} />
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Items */}
					<div className='border rounded-lg p-4 bg-gray-50'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='font-semibold flex items-center gap-2'>
								<Package size={16} />
								Productos ({items.length})
							</h3>
							<button
								type='button'
								onClick={addItem}
								className='flex items-center gap-1 px-3 py-1.5 border border-brown text-brown rounded-md hover:bg-brown hover:text-white transition-colors text-sm'>
								<Plus size={14} />
								Agregar producto
							</button>
						</div>

						<div className='space-y-4 max-h-80 overflow-y-auto p-1'>
							{items.map((item, idx) => (
								<div
									key={item.tempId}
									className='bg-white border rounded-lg p-4 space-y-3'>
									
									{/* Item header */}
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium text-gray-700'>
											Producto {idx + 1}
										</span>
										<div className='flex items-center gap-3'>
											<label className='flex items-center gap-2 text-sm cursor-pointer'>
												<span className='text-gray-600'>Personalizado</span>
												<button
													type='button'
													onClick={() => toggleCustom(item.tempId, !item.isCustom)}
													className={`relative w-9 h-5 rounded-full transition-colors ${item.isCustom ? 'bg-brown' : 'bg-gray-300'}`}>
													<span
														className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.isCustom ? 'translate-x-4' : ''}`}
													/>
												</button>
											</label>
											{items.length > 1 && (
												<button
													type='button'
													onClick={() => removeItem(item.tempId)}
													className='text-gray-400 hover:text-red-500 transition'>
													<Minus size={14} />
												</button>
											)}
										</div>
									</div>

									<div className='grid grid-cols-2 gap-3'>
										{/* PRODUCTO NORMAL */}
										{!item.isCustom && (
											<div className='col-span-2'>
												<label className='text-xs text-gray-500 mb-1 block'>
													Producto del catálogo *
												</label>
												<select
													value={item.productId}
													onChange={(e) =>
														updateItem(
															item.tempId,
															'productId',
															e.target.value,
														)
													}
													className={inputClass}>
													<option value=''>Seleccionar producto...</option>
													{products.map((p: any) => (
														<option key={p._id} value={p._id}>
															{p.name}
														</option>
													))}
												</select>
											</div>
										)}

										{/* PRODUCTO CUSTOM */}
										{item.isCustom && (
											<>
												<div className='col-span-2'>
													<label className='text-xs text-gray-500 mb-1 block'>
														Nombre del mueble *
													</label>
													<input
														type='text'
														placeholder='Ej: Mesa de comedor rústica'
														value={item.name}
														onChange={(e) =>
															updateItem(
																item.tempId,
																'name',
																e.target.value,
															)
														}
														className={inputClass}
													/>
												</div>

												<div className='col-span-2'>
													<label className='text-xs text-gray-500 mb-1 block'>
														Notas / descripción
													</label>
													<textarea
														rows={2}
														placeholder='Describe el mueble, materiales, estilo...'
														value={item.notes}
														onChange={(e) =>
															updateItem(
																item.tempId,
																'notes',
																e.target.value,
															)
														}
														className={`${inputClass} resize-none`}
													/>
												</div>

												<div className='col-span-2'>
													<label className='text-xs text-gray-500 mb-1 block'>
														Imagen de referencia
													</label>
													<label className='flex items-center gap-2 border border-dashed border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-brown transition'>
														<ImagePlus size={16} className='text-gray-400' />
														<span className='text-sm text-gray-600 truncate'>
															{item.imageFile
																? item.imageFile.name
																: 'Seleccionar imagen'}
														</span>
														<input
															type='file'
															accept='image/*'
															className='hidden'
															onChange={(e) => handleImageChange(item.tempId, e)}
														/>
													</label>
													{item.imagePreview && (
														<img
															src={item.imagePreview}
															alt='Preview'
															className='mt-2 h-24 object-contain rounded-md border'
														/>
													)}
												</div>
											</>
										)}

										{/* CAMPOS COMUNES */}
										<div>
											<label className='text-xs text-gray-500 mb-1 block'>
												Cantidad *
											</label>
											<input
												type='number'
												min={1}
												value={item.quantity}
												onChange={(e) =>
													updateItem(
														item.tempId,
														'quantity',
														Number(e.target.value),
													)
												}
												className={inputClass}
											/>
										</div>

										<div>
											<label className='text-xs text-gray-500 mb-1 block'>
												Precio unitario
											</label>
											<div className='relative'>
												<span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400'>
													$
												</span>
												<input
													type='number'
													min={0}
													value={item.price}
													onChange={(e) =>
														updateItem(
															item.tempId,
															'price',
															Number(e.target.value),
														)
													}
													className={`${inputClass} pl-6`}
												/>
											</div>
										</div>

										<div>
											<label className='text-xs text-gray-500 mb-1 block'>
												Color *
											</label>
											<input
												type='text'
												placeholder='Ej: Nogal'
												value={item.color}
												onChange={(e) =>
													updateItem(item.tempId, 'color', e.target.value)
												}
												className={inputClass}
											/>
										</div>

										<div>
											<label className='text-xs text-gray-500 mb-1 block'>
												Tamaño / Dimensiones
											</label>
											<input
												type='text'
												placeholder='Ej: 120x80x75cm'
												value={item.size}
												onChange={(e) =>
													updateItem(item.tempId, 'size', e.target.value)
												}
												className={inputClass}
											/>
										</div>

										<div className='col-span-2 flex justify-end pt-2 border-t'>
											<span className='text-sm text-gray-600'>
												Subtotal:{' '}
												<span className='font-semibold text-brown'>
													${(item.price * item.quantity).toLocaleString()}
												</span>
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Notas generales */}
					<div className='border rounded-lg p-4 bg-gray-50'>
						<h3 className='font-semibold mb-3 flex items-center gap-2'>
							<FileText size={16} />
							Notas generales
						</h3>
						<textarea
							rows={3}
							placeholder='Observaciones generales de la cotización...'
							value={adminNotes}
							onChange={(e) => setAdminNotes(e.target.value)}
							className='w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown resize-none bg-white'
						/>
					</div>

					{/* Resumen */}
					{totalEstimate > 0 && (
						<div className='p-4 bg-gray-50 rounded-lg border'>
							<div className='flex justify-between items-center'>
								<div>
									<span className='font-semibold text-lg'>Total estimado:</span>
									<p className='text-sm text-gray-600'>
										{items.length} {items.length === 1 ? 'producto' : 'productos'}
									</p>
								</div>
								<div className='text-right'>
									<span className='text-2xl font-bold text-brown'>
										${totalEstimate.toLocaleString()}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='sticky bottom-0 px-6 py-4 border-t bg-white flex justify-between items-center'>
					<button
						type='button'
						onClick={onClose}
						className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
						Cancelar
					</button>
					<button
						type='button'
						onClick={handleSave}
						disabled={isPending || !selectedUser}
						className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
							isPending || !selectedUser
								? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
								: 'text-brown hover:bg-brown hover:text-white'
						}`}>
						{isPending ? (
							<>
								<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
								Guardando...
							</>
						) : (
							<>
								<Save size={16} />
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