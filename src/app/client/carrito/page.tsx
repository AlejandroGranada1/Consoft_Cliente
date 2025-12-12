'use client';

import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMyCart } from '@/hooks/apiHooks';
import { usedeleteCartItem, useSubmitQuotation } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

export default function CartPage() {
	const router = useRouter();
	const { user } = useUser();

	// 🚨 PROTEGER RUTA 🚨
	useEffect(() => {
		if (user === null) {
			router.push('/client/auth/login');
		}
	}, [user, router]);

	// Si aún no sabemos si está logeado, evitar que se renderice la página
	if (user === undefined) {
		return <p className="p-6">Validando sesión...</p>;
	}

	// Si ya sabemos que no está logeado → no mostrar nada (porque ya está redirigiendo)
	if (user === null) {
		return null;
	}

	// --- SI LLEGÓ AQUÍ → ESTÁ LOGEADO ---

	const { data, isLoading } = useMyCart();
	const deleteItem = usedeleteCartItem();
	const submitQuotation = useSubmitQuotation();

	if (isLoading) return <p>Cargando carrito...</p>;

	const cart = data?.quotations?.[0];
	const items = cart?.items || [];

	const handleDeleteItem = (itemId: string) => {
		deleteItem.mutate(
			{ cartId: cart?._id!, itemId },
			{
				onSuccess: () => {
					Swal.fire('Eliminado', 'Producto eliminado del carrito.', 'success');
				},
			}
		);
	};

	const handleClearCart = async () => {
		const confirm = await Swal.fire({
			title: '¿Vaciar carrito?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, vaciar',
			cancelButtonText: 'Cancelar',
		});

		if (confirm.isConfirmed) {
			for (const item of items) {
				await deleteItem.mutateAsync({ cartId: cart?._id!, itemId: item._id });
			}

			Swal.fire('Carrito vacío', 'El carrito se vació con éxito.', 'success');
		}
	};

	const handleSendQuote = async () => {
		if (items.length === 0) {
			Swal.fire({
				icon: 'warning',
				title: 'El carrito está vacío',
				text: 'Agrega productos antes de enviar una cotización.',
			});
			return;
		}

		const result = await Swal.fire({
			title: '¿Enviar cotización?',
			text: 'Se enviará una solicitud con tus productos.',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Enviar',
			cancelButtonText: 'Cancelar',
		});

		if (result.isConfirmed) {
			await submitQuotation.mutateAsync(cart?._id!);

			Swal.fire({
				icon: 'success',
				title: 'Cotización enviada',
				text: 'Nos pondremos en contacto contigo pronto.',
			});
		}
	};

	return (
		<section className='p-10 max-w-3xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>Carrito</h1>

			{items.length === 0 ? (
				<p className='text-gray-600'>Tu carrito está vacío.</p>
			) : (
				<div className='space-y-6'>
					{items.map((item: any) => (
						<div
							key={item._id}
							className='flex gap-4 bg-white p-4 rounded-xl shadow-md'>
							<img
								src={
									item.product.imageUrl && item.product.imageUrl.trim() !== ''
										? item.product.imageUrl
										: '/def_prod.png'
								}
								alt={item.product.name}
								className='w-24 h-24 object-cover rounded-lg border'
							/>

							<div className='flex-1'>
								<p className='font-semibold text-lg'>{item.product.name}</p>
								<p className='text-sm text-gray-500'>Cantidad: {item.quantity}</p>
								{item.color && (
									<p className='text-sm text-gray-700'>Color: {item.color}</p>
								)}
								{item.size && (
									<p className='text-sm text-gray-700'>Tamaño: {item.size}</p>
								)}
								{item.notes && (
									<p className='text-sm text-gray-700'>Notas: {item.notes}</p>
								)}
							</div>

							<button
								onClick={() => handleDeleteItem(item._id)}
								className='text-red-600 text-sm mt-2 hover:underline'>
								Eliminar
							</button>
						</div>
					))}

					<div className='flex gap-4 mt-6'>
						<button
							onClick={handleClearCart}
							className='bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 cursor-pointer'>
							Vaciar carrito
						</button>

						<button
							onClick={handleSendQuote}
							className='bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 ml-auto cursor-pointer'>
							Solicitar cotización
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
