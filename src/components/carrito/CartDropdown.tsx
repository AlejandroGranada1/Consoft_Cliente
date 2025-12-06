'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { useMyCart, usedeleteCartItem } from '@/hooks/apiHooks';

export default function CartDropdown({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
}) {
	const { data, isLoading } = useMyCart();
	const deleteItem = usedeleteCartItem();

	if (!isOpen) return null;

	// ✔ Tomamos el carrito desde la API
	const cart = data?.quotations?.[0];
	const items = cart?.items || [];

	const handleDeleteItem = async (itemId: string) => {
		await deleteItem.mutateAsync({ cartId: cart._id, itemId });

		Swal.fire({
			title: 'Eliminado',
			text: 'Producto eliminado del carrito.',
			icon: 'success',
			timer: 1200,
			showConfirmButton: false,
		});
	};

	const handleGoToCart = () => {
		setIsOpen(false);
	};

	return (
		<div className='absolute right-0 top-14 w-80 bg-white shadow-xl rounded-xl p-5 z-50'>
			{/* Header */}
			<div className='flex justify-between items-center mb-4'>
				<h3 className='text-lg font-semibold'>Carrito</h3>
				<button onClick={() => setIsOpen(false)}>
					<X className='w-5 h-5' />
				</button>
			</div>

			{/* Loading */}
			{isLoading ? (
				<p className='text-gray-500 text-sm'>Cargando...</p>
			) : items.length === 0 ? (
				<p className='text-gray-500 text-sm'>Tu carrito está vacío.</p>
			) : (
				<div className='space-y-4 max-h-60 overflow-y-auto pr-2'>
					{items.map((item: any) => (
						<div
							key={item._id}
							className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
							<img
								src={
									item.product?.imageUrl && item.product.imageUrl.trim() !== ''
										? item.product.imageUrl
										: '/def_prod.png'
								}
								className='w-16 h-16 rounded-lg object-cover border'
								alt={item.product?.name || 'Producto sin nombre'}
							/>

							<div className='flex-1'>
								<p className='font-medium text-sm'>{item.product.name}</p>
								<p className='text-xs text-gray-500'>Cantidad: {item.quantity}</p>
								{item.color && (
									<p className='text-xs text-gray-700'>Color: {item.color}</p>
								)}
								{item.size && (
									<p className='text-xs text-gray-700'>Tamaño: {item.size}</p>
								)}
							</div>

							<button
								onClick={() => handleDeleteItem(item._id)}
								className='text-xs text-red-600 hover:underline'>
								Eliminar
							</button>
						</div>
					))}
				</div>
			)}

			{/* Footer */}
			{items.length > 0 && (
				<Link
					href='/client/carrito'
					onClick={handleGoToCart}
					className='block text-center mt-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'>
					Ver carrito
				</Link>
			)}
		</div>
	);
}
