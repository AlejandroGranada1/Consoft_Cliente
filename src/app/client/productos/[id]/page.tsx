'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useGetProductById, useQuickQuotation } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { useAddItemAutoCart } from '@/hooks/apiHooks';
import Image from 'next/image';

export default function ProductDetailPage() {
	const { id } = useParams();
	const router = useRouter();

	const { user } = useUser();

	const { data, isLoading } = useGetProductById(String(id));

	const product = data?.data;


	console.log(product)

	const quickQuotationMutation = useQuickQuotation();
	const addItemMutation = useAddItemAutoCart();

	const [quantity, setQuantity] = useState(1);
	const [color, setColor] = useState('');
	const [customSize, setCustomSize] = useState('');

	const addToCart = async () => {
		if (!user) {
			Swal.fire({
				title: 'Inicia sesión para añadir al carrito',
				icon: 'warning',
				showConfirmButton: false,
				timer: 1500,
			});
			router.push('/client/auth/login');
			return;
		}

		if (!product) return;

		try {
			const payload = {
				productId: product._id,
				quantity,
				color,
				size: customSize,
			};

			console.log(payload);
			await addItemMutation.mutateAsync(payload);

			Swal.fire({
				title: 'Añadido al carrito',
				text: 'El producto ha sido añadido correctamente',
				icon: 'success',
				confirmButtonColor: '#8B5A2B',
			});

			router.push('/client/productos');
		} catch (err) {
			console.log(err);
			Swal.fire({
				title: 'Error',
				text: 'No se pudo agregar al carrito',
				icon: 'error',
			});
		}
	};

	const requestQuotation = async () => {
		if (!user) {
			Swal.fire({
				title: 'Inicia sesión para solicitar una cotización',
				icon: 'warning',
				showConfirmButton: false,
				timer: 1500,
			});
			router.push('/client/auth/login');
			return;
		}

		if (!product) return;

		try {
			const payload = {
				productId: product._id,
				quantity,
				color,
				size: customSize,
			};
			await quickQuotationMutation.mutateAsync(payload);

			Swal.fire({
				title: 'Cotización solicitada',
				text: 'Tu solicitud de cotización se ha enviado correctamente',
				icon: 'success',
				confirmButtonColor: '#8B5A2B',
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: 'Error',
				text: 'No se pudo solicitar la cotización',
				icon: 'error',
			});
		}
	};

	if (isLoading) return <p className='p-10'>Cargando producto...</p>;
	if (!product) return <p className='p-10'>Producto no encontrado</p>;

	return (
		<section className='bg-[#f2f2f2] min-h-screen py-10 px-6'>
			<div className='max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-lg'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
					<div className='relative w-full h-80 rounded-xl overflow-hidden bg-gray-100 border flex items-center justify-center'>
						{product.imageUrl && product.imageUrl.trim() !== '' ? (
							<Image
								src={product.imageUrl}
								alt={product.name}
								fill
								className='object-contain'
							/>
						) : (
							<Image
								src='/def_prod.png'
								alt='Imagen por defecto'
								fill
								className='object-contain'
							/>
						)}
					</div>

					<div>
						<h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>
						<p className='text-gray-600 mt-2 leading-relaxed'>{product.description}</p>

						<hr className='my-6' />

						<div className='space-y-4'>
							<div>
								<label className='font-medium mr-4'>Cantidad</label>
								<input
									type='number'
									min='1'
									value={quantity}
									onChange={(e) => setQuantity(Number(e.target.value))}
									className='input-style w-24'
								/>
							</div>

							<div>
								<label className='font-medium'>Color</label>
								<input
									type='text'
									value={color}
									onChange={(e) => setColor(e.target.value)}
									className='input-style w-full'
									placeholder='Ej: Nogal, blanco...'
								/>
							</div>

							<div>
								<label className='font-medium'>Tamaño personalizado</label>
								<input
									type='text'
									value={customSize}
									onChange={(e) => setCustomSize(e.target.value)}
									className='input-style w-full'
									placeholder='Ej: 50x40'
								/>
							</div>
							<div className='mt-3 grid grid-cols-2 gap-4'>
								<button
									onClick={addToCart}
									className='w-full border border-brown  hover:bg-[#70461f] text-brown hover:text-white py-3 rounded-lg font-semibold transition cursor-pointer'>
									Agregar al carrito
								</button>
								<button
									onClick={requestQuotation}
									className='w-full border border-brown  hover:bg-[#70461f] text-brown hover:text-white py-3 rounded-lg font-semibold transition cursor-pointer'>
									Solicitar Cotizacion
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
