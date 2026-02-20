import { formatCOP } from '@/lib/formatCOP';
import { Quotation } from '@/lib/types';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface QuotationRowProps {
	q: Quotation;
	onView: () => void;
}

export default function QuotationRow({ onView, q }: QuotationRowProps) {
	return (
		<div className='table-preset md:grid-cols-5'>
			{/* Codigo */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Codigo: </span>
				{q?._id.slice(-4).toUpperCase()}
			</p>
			{/* Cliente */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Cliente: </span>
				{q?.user?.name}
			</p>
			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Estado: </span>
				{q?.status}
			</p>
			{/* Items */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Pagado:</span>
				{q?.items.length}
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
