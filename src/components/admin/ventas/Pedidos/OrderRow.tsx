import { Order, User } from '@/lib/types';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface OrderRowProps {
	order: Order;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function OrderRow({ onDelete, onEdit, onView, order }: OrderRowProps) {
	return (
		<div className='table-preset md:grid-cols-7'>
			{/* Id del pedido */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Id Pedido: </span>
				{order._id?.slice(-4).toUpperCase()}
			</p>
			{/* Cliente */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Cliente: </span>
				{(order.user as User).name}
			</p>
			{/* Valor */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Valor: </span>
				{order.items
					.reduce((total, item) => total + item.valor, 0)
					.toLocaleString('es-CO', {
						style: 'currency',
						currency: 'COP',
					})}
			</p>
			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Estado:</span>
				<span
					className={`${
						order.status == 'Completado'
							? 'text-blue-500'
							: order.status == 'Cancelado'
							? 'text-red'
							: 'text-orange'
					}`}>
					{order.status}
				</span>
			</p>

			{/* Estado pago */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Pago:</span>
				<span
					className={`${
						order.paymentStatus === 'Pagado' ? 'text-green-500' : 'text-orange'
					}`}>
					{order.paymentStatus}
				</span>
			</p>

			{/* Conteo items */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Items: </span>
				{order.items.length}
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
				<Pencil
					size={20}
					color='#7588f0'
					onClick={onEdit}
					className='cursor-pointer hover:scale-110 transition-transform'
					aria-label='Editar'
				/>
				<Trash2
					size={19}
					color='#fa4334'
					onClick={onDelete}
					className='cursor-pointer hover:scale-110 transition-transform'
					aria-label='Eliminar'
				/>
			</div>
		</div>
	);
}
