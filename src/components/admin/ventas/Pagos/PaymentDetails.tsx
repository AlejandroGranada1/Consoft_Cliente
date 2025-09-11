import { DefaultModalProps, PaymentDetails } from '@/app/types';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

function PaymentDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<PaymentDetails>) {
	if (!isOpen) return;
	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px]'>
				<header className='relative mb-4'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold text-center'>DETALLES DEL PAGO</h1>
				</header>
				<section className='grid grid-cols-2 gap-8'>
					{/* Id Pago */}
					<div className='flex flex-col'>
						<label className='font-semibold'>ID Pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.payment.id}
						</p>
					</div>

					{/* Id Pedido */}
					<div className='flex flex-col'>
						<label className='font-semibold'>ID Pedido</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.order.id}
						</p>
					</div>

					{/* Monto Total */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Monto Total</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.total}
						</p>
					</div>

					{/* Valor del pago */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Valor del pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.payment.amount}
						</p>
					</div>

					{/* Valor pendiente */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Valor pendiente</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.total! - extraProps?.payment.amount!}
						</p>
					</div>

					{/* Metodo */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Metrodo de pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.payment.method}
						</p>
					</div>

					{/* Estado del  pago */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Estado del pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.payment.status}
						</p>
					</div>

					{/* Fecha de pago */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Fecha de pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.payment.paymentDate}
						</p>
					</div>

                    <button
							type='submit'
                            onClick={onClose}
							className='px-6 py-2 border border-brown rounded-md text-brown hover:bg-brown hover:text-white transition col-span-2'>
							Volver
						</button>
				</section>
			</div>
		</div>
	);
}

export default PaymentDetailsModal;
