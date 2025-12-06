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

	// Estado para precios
	const [prices, setPrices] = useState<{ [id: string]: number }>({});

	// Estado para adminNotes
	const [adminNotes, setAdminNotes] = useState('');

	const setQuote = useSetQuote();

	const handlePrice = (id: string, value: number) => {
		setPrices((prev) => ({ ...prev, [id]: value }));
	};

	// Calcular subtotal de cada item
	const getSubtotal = (item: any) => {
		const price = prices[item._id] || 0;
		return price * item.quantity;
	};

	// Total general = totalEstimate
	const totalEstimate = items.reduce((sum: number, item: any) => sum + getSubtotal(item), 0);

	// Guardar cotización
	const handleSave = async () => {
		try {
			const payload = {
				totalEstimate,
				adminNotes,
			};

			console.log('ENVIAR A BACKEND:', payload);
			await setQuote.mutateAsync({
				id: quotation._id,
				...payload,
			});
			// Aquí deberías llamar a tu ruta:
			// await axios.put(`/api/quotations/set/${quotation._id}`, payload)

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
					{/* MUCHOS PRODUCTOS */}
					{items.length > 1 && (
						<div className='flex flex-col gap-4'>
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
												<span className='font-semibold'>Tamaño:</span>{' '}
												{item.size || '—'}
											</p>
											<p>
												<span className='font-semibold'>Color:</span>{' '}
												{item.color || '—'}
											</p>
											<p>
												<span className='font-semibold'>Cantidad:</span>{' '}
												{item.quantity}
											</p>
											{item.notes && (
												<p>
													<span className='font-semibold'>Notas:</span>{' '}
													{item.notes}
												</p>
											)}
											<p className='mt-1 font-semibold text-brown'>
												Subtotal: ${getSubtotal(item).toLocaleString()}
											</p>
										</div>

										{/* Precio */}
										<div className='flex flex-col gap-2'>
											<label className='font-semibold text-sm'>
												Valor unitario
											</label>
											<input
												type='number'
												className='border rounded-lg p-2 text-sm'
												placeholder='0'
												value={prices[item._id] || ''}
												onChange={(e) =>
													handlePrice(item._id, Number(e.target.value))
												}
											/>
										</div>
									</div>
								</details>
							))}
						</div>
					)}

					{/* SOLO UN PRODUCTO */}
					{items.length === 1 && (
						<div className='border p-5 rounded-lg bg-gray-50 grid grid-cols-[150px_1fr_150px] gap-6'>
							{/* Imagen */}
							<div className='relative w-40 h-40 border rounded-lg overflow-hidden'>
								<Image
									src={getImage(items[0].product?.imageUrl)}
									fill
									alt={items[0].product?.name}
									className='object-cover'
								/>
							</div>

							{/* Info */}
							<div className='flex flex-col gap-2 text-sm'>
								<h2 className='font-semibold text-lg'>{items[0].product?.name}</h2>

								<p>
									<span className='font-semibold'>Cantidad:</span>{' '}
									{items[0].quantity}
								</p>
								<p>
									<span className='font-semibold'>Tamaño:</span>{' '}
									{items[0].size || '—'}
								</p>
								<p>
									<span className='font-semibold'>Color:</span>{' '}
									{items[0].color || '—'}
								</p>
								{items[0].notes && (
									<p>
										<span className='font-semibold'>Notas:</span>{' '}
										{items[0].notes}
									</p>
								)}

								<p className='mt-1 font-semibold'>
									Subtotal: ${getSubtotal(items[0]).toLocaleString()}
								</p>
							</div>

							{/* Precio */}
							<div className='flex flex-col gap-2'>
								<label className='font-semibold text-sm'>Valor unitario</label>
								<input
									type='number'
									className='border rounded-lg p-2 text-sm'
									placeholder='0'
									value={prices[items[0]._id] || ''}
									onChange={(e) =>
										handlePrice(items[0]._id, Number(e.target.value))
									}
								/>
							</div>
						</div>
					)}

					{/* NOTAS ADMIN */}
					<div className='flex flex-col gap-2'>
						<label className='font-semibold text-sm'>Notas del administrador</label>
						<textarea
							className='border p-3 rounded-lg text-sm'
							rows={3}
							placeholder='Notas para el cliente...'
							value={adminNotes}
							onChange={(e) => setAdminNotes(e.target.value)}
						/>
					</div>

					{/* TOTAL GENERAL */}
					<div className='text-right mt-4'>
						<p className='text-lg font-semibold'>
							Total:{' '}
							<span className='text-brown text-xl'>
								${totalEstimate.toLocaleString()}
							</span>
						</p>
					</div>

					{/* BOTÓN GUARDAR */}
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
