'use client';
import { X } from 'lucide-react';
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

	const setQuote = useSetQuote();

	/* -------------------- INIT -------------------- */

	useEffect(() => {
		if (!isOpen) return;

		const priceInit: any = {};
		const notesInit: any = {};

		items.forEach((item: any) => {
			priceInit[item._id] = item.price ?? 0;
			notesInit[item._id] = item.adminNotes || '';
		});

		setPrices(priceInit);
		setItemNotes(notesInit);
		setAdminNotes(quotation.adminNotes || '');
	}, [isOpen]);

	/* -------------------- HANDLERS -------------------- */

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

			Swal.fire('Cotización guardada', '', 'success');
			if (updateList) updateList();
			onClose();
		} catch (err) {
			Swal.fire('Error', 'No se pudo guardar la cotización', 'error');
		}
	};

	/* -------------------- UI -------------------- */

	return (
		<div className='fixed inset-0 bg-black/20 flex items-center justify-center z-50'>
			<div className='bg-white rounded-xl shadow-lg w-[900px] max-h-[90vh] overflow-y-auto p-6'>
				<header className='relative mb-6'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 text-gray-500 hover:text-black'>
						<X />
					</button>
					<h1 className='text-xl font-semibold text-center'>
						COTIZACIÓN – {quotation.user.name}
					</h1>
				</header>

				<section className='flex flex-col gap-5'>
					{items.map((item: any) => (
						<details
							key={item._id}
							className='border rounded-lg p-4 bg-gray-50'>
							<summary className='cursor-pointer font-semibold'>
								{item.product?.name} (x{item.quantity})
							</summary>

							<div className='mt-4 grid grid-cols-[90px_1fr_160px] gap-6'>
								<div className='relative w-24 h-24 border rounded-lg overflow-hidden'>
									<Image
										src={getImage(item.product?.imageUrl)}
										fill
										alt={item.product?.name}
										className='object-cover'
									/>
								</div>

								<div className='text-sm flex flex-col gap-1'>
									<p><b>Tamaño:</b> {item.size || '—'}</p>
									<p><b>Color:</b> {item.color || '—'}</p>
									<p><b>Cantidad:</b> {item.quantity}</p>
									{item.notes && <p><b>Notas:</b> {item.notes}</p>}
									<p className='mt-1 font-semibold text-brown'>
										Subtotal: ${getSubtotal(item).toLocaleString()}
									</p>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='font-semibold text-sm'>Valor unitario</label>
									<input
										type='number'
										className='border rounded-md p-2'
										value={prices[item._id] || 0}
										onChange={(e) =>
											handlePrice(item._id, Number(e.target.value))
										}
									/>

									<label className='font-semibold text-sm mt-2'>Notas admin</label>
									<textarea
										className='border rounded-md p-2 text-sm'
										rows={2}
										value={itemNotes[item._id] || ''}
										onChange={(e) =>
											handleItemNote(item._id, e.target.value)
										}
									/>
								</div>
							</div>
						</details>
					))}

					<div>
						<label className='font-semibold text-sm'>Notas generales</label>
						<textarea
							className='border p-3 rounded-md w-full mt-1'
							rows={3}
							value={adminNotes}
							onChange={(e) => setAdminNotes(e.target.value)}
						/>
					</div>

					<div className='text-right text-lg font-semibold'>
						Total:{' '}
						<span className='text-brown text-xl'>
							${totalEstimate.toLocaleString()}
						</span>
					</div>

					{/* BOTONES */}
					<div className='flex justify-between mt-6'>
						<button
							onClick={onClose}
							className='border px-6 py-2 rounded-md'>
							Cancelar
						</button>

						<button
							onClick={handleSave}
							className='bg-brown text-white px-6 py-2 rounded-md font-semibold hover:opacity-90'>
							Guardar cotización
						</button>
					</div>
				</section>
			</div>
		</div>
	);
}

export default QuotationModal;
