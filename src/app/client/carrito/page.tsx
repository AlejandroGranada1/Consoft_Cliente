'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMyCart } from '@/hooks/apiHooks';
import { useDeleteCartItem, useSubmitQuotation } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

export default function CartPage() {
	const router = useRouter();
	const { user, loading } = useUser();
	const { data, isLoading } = useMyCart();
	const deleteItem = useDeleteCartItem();
	const submitQuotation = useSubmitQuotation();
	// 🚨 PROTEGER RUTA 🚨
	useEffect(() => {
		if (loading) return;

		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;

				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes registrarte o iniciar sesión para agendar una cita.',
				});

				router.push('/client/auth/login');
			})();
		}
	}, [user, router]);

	if (user === undefined) {
		return <p className='p-6'>Validando sesión...</p>;
	}

	if (user === null) {
		return null;
	}

	if (isLoading) return <p>Cargando carrito...</p>;

	const cart = data?.quotations?.[0];
	const items = cart?.items || [];
	const isCartActive = cart?.status == 'Carrito';

	const handleDeleteItem = async (itemId: string) => {
		const Swal = (await import('sweetalert2')).default;

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
		const Swal = (await import('sweetalert2')).default;

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
		const Swal = (await import('sweetalert2')).default;
		try {
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
				const response = await submitQuotation.mutateAsync(cart?._id!);

				if (response.status == 200) {
					Swal.fire({
						icon: 'success',
						title: 'Cotización enviada',
						text: 'Nos pondremos en contacto contigo pronto.',
					});
				}
			}
		} catch (error: any) {
			const message =
				error.response.data.message == 'The Quotation has already been requested'
					? 'La cotizacion ya fue solicitada'
					: `Error al solicitar la cotizacion: ${error.response.data.message}`;
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: message,
			});
		}
	};

	if (!cart) {
		return (
			<section className='p-10 max-w-3xl mx-auto'>
				<h1 className='text-3xl font-bold mb-6'>Carrito</h1>
				<p className='text-gray-600'>No tienes un carrito activo.</p>
			</section>
		);
	}

	if (!isCartActive) {
		return (
			<section className='p-10 max-w-3xl mx-auto'>
				<h1 className='text-3xl font-bold mb-6'>Carrito</h1>

				<div className='bg-yellow-50 border border-yellow-300 text-yellow-800 p-5 rounded-xl'>
					<p className='font-medium'>Ya se ha solicitado una cotizacion para este carrito.</p>
					<p className='text-sm mt-1'>
						Si deseas solicitar una nueva cotizacion, espera a terminar la anterior
					</p>
				</div>
			</section>
		);
	}

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
