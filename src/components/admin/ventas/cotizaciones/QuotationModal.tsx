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
	AlertCircle,
	Calendar
} from 'lucide-react';
import { useSetQuote } from '@/hooks/apiHooks';
import { DefaultModalProps } from '@/lib/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { formatCOP } from '@/lib/formatCOP';

function QuotationModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps) {
	const setQuote = useSetQuote();

	// Todos los hooks se ejecutan SIEMPRE, sin condiciones
	const [prices, setPrices] = useState<{ [id: string]: number }>({});
	const [itemNotes, setItemNotes] = useState<{ [id: string]: string }>({});
	const [adminNotes, setAdminNotes] = useState('');
	const [openItems, setOpenItems] = useState<{ [id: string]: boolean }>({});

	const quotation = extraProps as any;
	const items = quotation?.items || [];
	
	const getImage = (url?: string) =>
		url && url.trim() !== '' ? url : '/def_prod.png';

	// Inicializar estados cuando cambian los props
	useEffect(() => {
		if (!isOpen || !quotation) return;

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
	}, [isOpen, quotation, items]);

	// Handlers
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
				return Swal.fire({
					title: 'Precio inválido',
					text: 'Todos los productos deben tener un valor mayor a 0',
					icon: 'warning',
					background: '#1e1e1c',
					color: '#fff',
				});
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
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Cotización guardada',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});
			if (updateList) updateList();
			onClose();
		} catch (err) {
			Swal.fire({
				title: 'Error',
				text: 'No se pudo guardar la cotización',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		}
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('es-CO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Retorno condicional DESPUÉS de todos los hooks
	if (!isOpen || !extraProps) return null;

	/* -------------------- UI -------------------- */
	return (
		<div className='fixed top-18 left-72 inset-0 z-50 flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
			
			<div className="w-full max-w-[1000px] rounded-2xl border border-white/10
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
						Cotización #{quotation._id?.slice(-6).toUpperCase()}
					</h2>
				</header>

				<div className="p-6 overflow-y-auto space-y-6">
					
					{/* Información del cliente */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<div className="flex items-start justify-between">
							<div>
								<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
									<User size={16} className="text-[#C8A882]" />
									Cliente
								</h3>
								<p className="text-base font-medium text-white">
									{quotation.user?.name}
								</p>
								<p className="text-sm text-white/60 mt-1">
									{quotation.user?.email}
								</p>
								{quotation.user?.phone && (
									<p className="text-sm text-white/60 mt-1">
										Tel: {quotation.user.phone}
									</p>
								)}
							</div>
							<div className="text-right">
								<span className="text-xs text-white/40">Fecha</span>
								<p className="text-sm font-medium text-white/90 flex items-center gap-1 mt-1">
									<Calendar size={14} className="text-[#C8A882]" />
									{formatDate(quotation.createdAt)}
								</p>
							</div>
						</div>
					</div>

					{/* Productos */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-sm font-medium text-white flex items-center gap-2">
								<Package size={16} className="text-[#C8A882]" />
								Productos ({items.length})
							</h3>
						</div>

						<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
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
										className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
										
										{/* Header del producto (clickeable) */}
										<button
											type="button"
											onClick={() => toggleItem(item._id)}
											className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/8 transition-colors">
											<div className="flex items-center gap-3">
												<div className="relative w-10 h-10 rounded-lg border border-white/10 overflow-hidden bg-white/5">
													<Image
														src={getImage(itemImage)}
														fill
														alt={itemName}
														className="object-cover"
													/>
												</div>
												<div className="text-left">
													<p className="text-sm font-medium text-white">
														{itemName}
													</p>
													<p className="text-xs text-white/40">
														Cantidad: {item.quantity} | Subtotal: {formatCOP(getSubtotal(item))}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<span className={`text-xs px-2 py-1 rounded-full ${
													prices[item._id] > 0 
														? 'bg-green-500/10 text-green-400 border border-green-500/20' 
														: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
												}`}>
													{formatCOP(prices[item._id])} c/u
												</span>
												{openItems[item._id] ? (
													<ChevronUp size={16} className="text-white/40" />
												) : (
													<ChevronDown size={16} className="text-white/40" />
												)}
											</div>
										</button>

										{/* Detalles expandibles */}
										{openItems[item._id] && (
											<div className="p-4 border-t border-white/10 bg-white/5">
												<div className="grid grid-cols-[120px_1fr] gap-6">
													
													{/* Imagen grande */}
													<div className="relative w-28 h-28 rounded-lg border border-white/10 overflow-hidden bg-white/5">
														<Image
															src={getImage(itemImage)}
															fill
															alt={itemName}
															className="object-cover"
														/>
													</div>

													{/* Detalles del producto */}
													<div className="space-y-3">
														<div className="grid grid-cols-2 gap-3">
															<div className="flex items-center gap-2 text-sm">
																<Ruler size={14} className="text-white/40" />
																<span className="text-white/70">
																	<span className="text-white/40">Tamaño:</span> {item.size || '—'}
																</span>
															</div>
															<div className="flex items-center gap-2 text-sm">
																<Palette size={14} className="text-white/40" />
																<span className="text-white/70">
																	<span className="text-white/40">Color:</span> {item.color || '—'}
																</span>
															</div>
															<div className="flex items-center gap-2 text-sm">
																<Hash size={14} className="text-white/40" />
																<span className="text-white/70">
																	<span className="text-white/40">Cantidad:</span> {item.quantity}
																</span>
															</div>
														</div>
														
														{item.notes && (
															<p className="text-sm bg-blue-500/10 text-blue-400 p-2 rounded-lg border border-blue-500/20">
																<span className="font-medium">Notas del cliente:</span> {item.notes}
															</p>
														)}
													</div>

													{/* Configuración de precio */}
													<div className="col-span-2 grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/10">
														<div className="space-y-2">
															<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
																Valor unitario *
															</label>
															<div className="relative">
																<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
																	$
																</span>
																<input
																	type="number"
																	min="1"
																	value={prices[item._id] || 0}
																	onChange={(e) =>
																		handlePrice(item._id, Number(e.target.value))
																	}
																	className="w-full rounded-xl border border-white/15 bg-white/5 pl-6 pr-3 py-2
																		text-sm text-white
																		focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
																		transition-all duration-200"
																/>
															</div>
														</div>

														<div className="space-y-2">
															<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
																Notas de administrador
															</label>
															<div className="relative">
																<Edit size={14} className="absolute left-3 top-3 text-white/40" />
																<input
																	type="text"
																	placeholder="Notas internas..."
																	value={itemNotes[item._id] || ''}
																	onChange={(e) =>
																		handleItemNote(item._id, e.target.value)
																	}
																	className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-3 py-2
																		text-sm text-white placeholder:text-white/30
																		focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
																		transition-all duration-200"
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

					{/* Resumen y total */}
					<div className="p-4 rounded-xl border border-white/10 bg-white/5">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm font-medium text-white">Total de la cotización</p>
								<p className="text-xs text-white/40 mt-1">
									{items.length} {items.length === 1 ? 'producto' : 'productos'}
								</p>
							</div>
							<div className="text-right">
								<span className="text-2xl font-bold text-[#C8A882]">
									{formatCOP(totalEstimate)}
								</span>
								{totalEstimate === 0 && (
									<p className="text-xs text-yellow-400/70 mt-1 flex items-center gap-1">
										<AlertCircle size={12} />
										Define los precios de los productos
									</p>
								)}
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
							Cancelar
						</button>
						<button
							type="button"
							onClick={handleSave}
							disabled={setQuote.isPending || totalEstimate === 0}
							className="px-5 py-2.5 rounded-lg
								bg-[#8B5E3C] hover:bg-[#6F452A]
								text-white text-sm font-medium
								shadow-lg shadow-[#8B5E3C]/20
								disabled:opacity-50 disabled:cursor-not-allowed
								flex items-center gap-2
								transition-all duration-200">
							{setQuote.isPending ? (
								<>
									<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
									Guardando...
								</>
							) : (
								<>
									<Save size={14} />
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