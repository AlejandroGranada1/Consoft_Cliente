import { formatCOP } from '@/lib/formatCOP';
import { formatDateForInput } from '@/lib/formatDate';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface PaymentRowProps {
	p: any;
	onView: () => void;
}

export default function PaymentRow({ onView, p }: PaymentRowProps) {
	return (
		<div className='table-preset md:grid-cols-8'>
			{/* Id de pago */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Id pago: </span>
				{p.payment._id.slice(-4).toUpperCase()}
			</p>
			{/* Id del pedido */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Pedido: </span>
				{p.summary._id.slice(-4)}
			</p>
			{/* Monto total */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Monto total: </span>
				{formatCOP(p.summary.total)}
			</p>
			{/* Valor del pago */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Valor del pago:</span>
				{formatCOP(p.payment.amount)}
			</p>

			{/* Pendiente */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Pendiente:</span>
				{formatCOP(p.payment.restante)}
			</p>

			{/* Fecha de pago */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Fecha de pago:</span>
				{formatDateForInput(p.payment.paidAt)}
			</p>

			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Items: </span>
				<span
					className={`${
						p.payment.status.toLowerCase() === 'aprobado'
							? 'text-green-500'
							: 'text-orange'
					}`}>
					{p.payment.status}
				</span>
			</p>
			{/* Acciones */}
			<div className='flex gap-4 justify-center w-full md:w-auto'>
				<Eye
					size={20}
					color='#d9b13b'
					onClick={onView}
					className='cursor-pointer hover:scale-110 transition-transform'
					aria-label='Ver detalles'
				/>
			</div>
		</div>
	);
}
