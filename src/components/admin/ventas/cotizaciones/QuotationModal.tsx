'use client';
import { 
	X, 
	Package, 
	User, 
	FileText, 
	Image as ImageIcon,
	ChevronDown,
	ChevronUp,
	Save,
	Ruler,
	Palette,
	Hash,
	Edit,
	AlertCircle
} from 'lucide-react';
import { useSetQuote } from '@/hooks/apiHooks';
import { DefaultModalProps } from '@/lib/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function QuotationModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps) {
	if (!isOpen || !extraProps) return null;

	const quotation = extraProps as any;
	const items = quotation.items || [];
	
	const getImage = (url?: string) =>
		url && url.trim() !== '' ? url : '/def_prod.png';

	/* -------------------- STATE -------------------- */

	const [prices, setPrices] = useState<{ [id: string]: number }>({});
	const [itemNotes, setItemNotes] = useState<{ [id: string]: string }>({});
	const [adminNotes, setAdminNotes] = useState('');
	const [openItems, setOpenItems] = useState<{ [id: string]: boolean }>({});

	const setQuote = useSetQuote();

	/* -------------------- INIT -------------------- */

	useEffect(() => {
		if (!isOpen) return;

		const priceInit: any = {};
		const notesInit: any = {};
		const openInit: any = {};

		items.forEach((item: any) => {
			priceInit[item._id] = item.price ?? 0;
			notesInit[item._id] = item.adminNotes || '';
			openInit[item._id] = false;
		});

		setPrices(priceInit);
		setItemNotes(notesInit);
		setOpenItems(openInit);
		setAdminNotes(quotation.adminNotes || '');
	}, [isOpen, items]);

	/* -------------------- HANDLERS -------------------- */

	const toggleItem = (id: string) => {
		setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const handlePrice = (id: string, value: number) => {
		setPrices((prev) => ({ ...prev, [id]: value }));
	};

	const handleItemNote = (id: string, value: string) => {
		setItemNotes((prev) => ({ ...prev, [id]: value }));
	};

	const getSubtotal = (item: any) =>
		(prices[item._id] || 0) * item.quantity;

	const totalEstimate = items.reduce(
		(sum: number, item: any) => sum + getSubtotal(item),
		0
	);

	const handleSave = async () => {
		for (const item of items) {
			if (!prices[item._id] || prices[item._id] <= 0) {
				return Swal.fire(
					'Precio inválido',
					'Todos los productos deben tener un valor mayor a 0',
					'warning'
				);
			}
		}

		try {
			await setQuote.mutateAsync({
				id: quotation._id,
				totalEstimate,
				adminNotes,
				items: items.map((item: any) => ({
					_id: item._id,
					price: prices[item._id],
					adminNotes: itemNotes[item._id] || '',
				})),
			});

			Swal.fire({
				icon: 'success',
				title: 'Cotización guardada',
				text: 'Los cambios han sido aplicados correctamente',
				timer: 1500,
				showConfirmButton: false
			});
			if (updateList) updateList();
			onClose();
		} catch (err) {
			Swal.fire('Error', 'No se pudo guardar la cotización', 'error');
		}
	};

	/* -------------------- UI -------------------- */

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-[900px] flex flex-col max-h-[92vh]'>
				
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<FileText size={20} /> Cotización
					</h1>
				</header>

				<div className='space-y-6 p-6 overflow-y-auto'>
					
					{/* Información del cliente */}
					<div className='border rounded-lg p-4 bg-gray-50'>
						<div className='flex items-start justify-between'>
							<div>
								<h3 className='font-semibold flex items-center gap-2 mb-2'>
									<User size={16} />
									Cliente
								</h3>
								<p className='text-lg font-medium text-gray-800'>
									{quotation.user?.name}
								</p>
								<p className='text-sm text-gray-600'>
									{quotation.user?.email}
								</p>
								{quotation.user?.phone && (
									<p className='text-sm text-gray-600 mt-1'>
										Tel: {quotation.user.phone}
									</p>
								)}
							</div>
							<div className='text-right'>
								<span className='text-xs text-gray-500'>Fecha</span>
								<p className='text-sm font-medium'>
									{new Date(quotation.createdAt).toLocaleDateString('es-CO', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>
						</div>
					</div>

					{/* Productos */}
					<div className='border rounded-lg p-4 bg-gray-50'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='font-semibold flex items-center gap-2'>
								<Package size={16} />
								Productos ({items.length})
							</h3>
						</div>

						<div className='space-y-3'>
							{items.map((item: any) => {
								const itemName = item.isCustom 
									? item.customDetails?.name 
									: item.product?.name;
								
								const itemImage = item.isCustom 
									? item.customDetails?.referenceImage 
									: item.product?.imageUrl;

								return (
									<div
										key={item._id}
										className='bg-white border rounded-lg overflow-hidden'>
										
										{/* Header del producto (clickeable) */}
										<button
											type='button'
											onClick={() => toggleItem(item._id)}
											className='w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors'>
											<div className='flex items-center gap-3'>
												<div className='relative w-10 h-10 border rounded-md overflow-hidden bg-gray-100'>
													<Image
														src={getImage(itemImage)}
														fill
														alt={itemName}
														className='object-cover'
													/>
												</div>
												<div className='text-left'>
													<p className='font-medium text-gray-800'>
														{itemName}
													</p>
													<p className='text-xs text-gray-500'>
														Cantidad: {item.quantity} | Subtotal: ${getSubtotal(item).toLocaleString()}
													</p>
												</div>
											</div>
											<div className='flex items-center gap-2'>
												<span className={`text-xs px-2 py-1 rounded-full ${
													prices[item._id] > 0 
														? 'bg-green-100 text-green-700' 
														: 'bg-yellow-100 text-yellow-700'
												}`}>
													${prices[item._id]?.toLocaleString()} c/u
												</span>
												{openItems[item._id] ? (
													<ChevronUp size={16} className='text-gray-400' />
												) : (
													<ChevronDown size={16} className='text-gray-400' />
												)}
											</div>
										</button>

										{/* Detalles expandibles */}
										{openItems[item._id] && (
											<div className='p-4 border-t bg-gray-50'>
												<div className='grid grid-cols-[120px_1fr] gap-6'>
													
													{/* Imagen grande */}
													<div className='relative w-28 h-28 border rounded-lg overflow-hidden bg-white'>
														<Image
															src={getImage(itemImage)}
															fill
															alt={itemName}
															className='object-cover'
														/>
													</div>

													{/* Detalles del producto */}
													<div className='space-y-3'>
														<div className='grid grid-cols-2 gap-3'>
															<div className='flex items-center gap-2 text-sm'>
																<Ruler size={14} className='text-gray-400' />
																<span><b>Tamaño:</b> {item.size || '—'}</span>
															</div>
															<div className='flex items-center gap-2 text-sm'>
																<Palette size={14} className='text-gray-400' />
																<span><b>Color:</b> {item.color || '—'}</span>
															</div>
															<div className='flex items-center gap-2 text-sm'>
																<Hash size={14} className='text-gray-400' />
																<span><b>Cantidad:</b> {item.quantity}</span>
															</div>
														</div>
														
														{item.notes && (
															<p className='text-sm bg-blue-50 p-2 rounded'>
																<b>Notas del cliente:</b> {item.notes}
															</p>
														)}
													</div>

													{/* Configuración de precio */}
													<div className='col-span-2 grid grid-cols-2 gap-4 mt-3 pt-3 border-t'>
														<div>
															<label className='text-xs font-medium text-gray-500 mb-1 block'>
																Valor unitario *
															</label>
															<div className='relative'>
																<span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400'>
																	$
																</span>
																<input
																	type='number'
																	min='1'
																	className='w-full border pl-6 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
																	value={prices[item._id] || 0}
																	onChange={(e) =>
																		handlePrice(item._id, Number(e.target.value))
																	}
																/>
															</div>
														</div>

														<div>
															<label className='text-xs font-medium text-gray-500 mb-1 block'>
																Notas de administrador
															</label>
															<div className='relative'>
																<Edit size={14} className='absolute left-3 top-3 text-gray-400' />
																<input
																	type='text'
																	placeholder='Notas internas...'
																	className='w-full border pl-9 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
																	value={itemNotes[item._id] || ''}
																	onChange={(e) =>
																		handleItemNote(item._id, e.target.value)
																	}
																/>
															</div>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								);
							})}
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

					{/* Resumen y total */}
					<div className='p-4 bg-gray-50 rounded-lg border'>
						<div className='flex justify-between items-center'>
							<div>
								<span className='font-semibold text-lg'>Total de la cotización:</span>
								<p className='text-sm text-gray-600'>
									{items.length} {items.length === 1 ? 'producto' : 'productos'}
								</p>
							</div>
							<div className='text-right'>
								<span className='text-2xl font-bold text-brown'>
									${totalEstimate.toLocaleString()}
								</span>
								{totalEstimate === 0 && (
									<p className='text-xs text-yellow-600 flex items-center gap-1 mt-1'>
										<AlertCircle size={12} />
										Define los precios de los productos
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Botones */}
					<div className='flex justify-between pt-4 border-t'>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
							Cancelar
						</button>
						<button
							type='button'
							onClick={handleSave}
							disabled={setQuote.isPending || totalEstimate === 0}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								setQuote.isPending || totalEstimate === 0
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{setQuote.isPending ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
									Guardando...
								</>
							) : (
								<>
									<Save size={16} />
									Guardar cotización
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default QuotationModal;