import { useSetQuote } from '@/hooks/apiHooks';
import { DefaultModalProps } from '@/lib/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

function QuotationModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps) {
	if (!isOpen || !extraProps) return null;

	const quotation = extraProps as any;
	const items = quotation.items || [];

	const getImage = (url: string | undefined) =>
		url && url.trim() !== '' ? url : '/def_prod.png';

	// Inicializar precios por item
	const [prices, setPrices] = useState<{ [id: string]: number }>(() => {
		const initial: { [id: string]: number } = {};
		items.forEach((item: any) => {
			initial[item._id] = item.price ?? 0;
		});
		return initial;
	});

	// Inicializar notas por item
	const [itemNotes, setItemNotes] = useState<{ [id: string]: string }>(() => {
		const initial: { [id: string]: string } = {};
		items.forEach((item: any) => {
			initial[item._id] = item.adminNotes || '';
		});
		return initial;
	});

	// Notas generales del admin
	const [adminNotes, setAdminNotes] = useState(quotation.adminNotes || '');

	const setQuote = useSetQuote();

	const handlePrice = (id: string, value: number) => {
		setPrices((prev) => ({ ...prev, [id]: value }));
	};

	const handleItemNote = (id: string, value: string) => {
		setItemNotes((prev) => ({ ...prev, [id]: value }));
	};

	// Subtotal por item
	const getSubtotal = (item: any) => {
		const price = prices[item._id] ?? 0;
		return price * item.quantity;
	};

	// Total general
	const totalEstimate = items.reduce((sum: number, item: any) => sum + getSubtotal(item), 0);

	// Guardar cotización
	const handleSave = async () => {
		try {
			const payload = {
				totalEstimate,
				adminNotes,
				items: items.map((item: any) => ({
					_id: item._id,
					price: Number(prices[item._id] ?? 0), // garantiza número
					adminNotes: itemNotes[item._id] || '',
				})),
			};

			console.log('ENVIAR A BACKEND:', payload);

			await setQuote.mutateAsync({
				id: quotation._id,
				...payload,
			});

			if (updateList) updateList();
			onClose();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[850px] p-6'>
				{/* HEADER */}
				<header className='relative mb-6'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold text-center'>
						COTIZACIÓN PARA {quotation.user.name}
					</h1>
				</header>

				{/* BODY */}
				<section className='flex flex-col gap-5'>
					{items.map((item: any) => (
						<details
							key={item._id}
							className='border border-gray-300 rounded-lg p-4 bg-gray-50'>
							<summary className='cursor-pointer font-semibold'>
								{item.product?.name} (x{item.quantity})
							</summary>

							<div className='mt-4 grid grid-cols-[90px_1fr_140px] gap-6 items-start'>
								{/* Imagen */}
								<div className='relative w-24 h-24 border rounded-lg overflow-hidden'>
									<Image
										src={getImage(item.product?.imageUrl)}
										fill
										alt={item.product?.name}
										className='object-cover'
									/>
								</div>

								{/* Información */}
								<div className='flex flex-col gap-1 text-sm'>
									<p>
										<span className='font-semibold'>Tamaño:</span> {item.size || '—'}
									</p>
									<p>
										<span className='font-semibold'>Color:</span> {item.color || '—'}
									</p>
									<p>
										<span className='font-semibold'>Cantidad:</span> {item.quantity}
									</p>
									{item.notes && (
										<p>
											<span className='font-semibold'>Notas:</span> {item.notes}
										</p>
									)}
									<p className='mt-1 font-semibold text-brown'>
										Subtotal: ${getSubtotal(item).toLocaleString()}
									</p>
								</div>

								{/* Precio y notas por item */}
								<div className='flex flex-col gap-2'>
									<label className='font-semibold text-sm'>Valor unitario</label>
									<input
										type='number'
										className='border rounded-lg p-2 text-sm'
										placeholder='0'
										value={prices[item._id] ?? 0}
										onChange={(e) => handlePrice(item._id, Number(e.target.value))}
									/>

									<label className='font-semibold text-sm mt-2'>Notas admin</label>
									<textarea
										className='border p-2 rounded-lg text-sm'
										rows={2}
										placeholder='Notas para este producto...'
										value={itemNotes[item._id] || ''}
										onChange={(e) => handleItemNote(item._id, e.target.value)}
									/>
								</div>
							</div>
						</details>
					))}

					{/* Notas generales del admin */}
					<div className='flex flex-col gap-2'>
						<label className='font-semibold text-sm'>Notas generales del administrador</label>
						<textarea
							className='border p-3 rounded-lg text-sm'
							rows={3}
							placeholder='Notas para el cliente...'
							value={adminNotes}
							onChange={(e) => setAdminNotes(e.target.value)}
						/>
					</div>

					{/* Total general */}
					<div className='text-right mt-4'>
						<p className='text-lg font-semibold'>
							Total:{' '}
							<span className='text-brown text-xl'>${totalEstimate.toLocaleString()}</span>
						</p>
					</div>

					{/* Botón guardar */}
					<button
						onClick={handleSave}
						className='bg-brown text-white py-2 rounded-lg font-semibold hover:opacity-90 mt-3'>
						Guardar Cotización
					</button>
				</section>
			</div>
		</div>
	);
}

export default QuotationModal;
