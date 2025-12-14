import { formatCOP } from '@/lib/formatCOP';
import { Order, Sale, User } from '@/lib/types';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface SaleRowProps {
	sale: Sale;
	onView: () => void;
}

export default function SaleRow({ onView, sale }: SaleRowProps) {
	return (
		<div className='table-preset md:grid-cols-6'>
			{/* Id de venta */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Id Venta: </span>
				{sale.order._id?.slice(-4).toUpperCase()}
			</p>
			{/* Cliente */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Cliente: </span>
				{(sale.user as User).name}
			</p>
			{/* Total */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Total: </span>
				{formatCOP(sale.total)}
			</p>
			{/* Pagado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Pagado:</span>
				{formatCOP(sale.paid)}
			</p>

			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Estado:</span>
				<span
					className={`px-2 py-1 rounded-full font-semibold text-sm ${
						sale.restante === 0
							? 'bg-green-200 text-green-800'
							: 'bg-orange-200 text-orange-800'
					}`}>
					{sale.restante === 0 ? 'Pagado' : 'Pendiente'}
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
