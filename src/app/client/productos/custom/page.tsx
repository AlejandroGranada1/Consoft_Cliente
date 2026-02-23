// app/client/productos/custom/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAddCustomItem } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import Image from 'next/image';
import { ArrowLeft, Upload, Sparkles } from 'lucide-react';

const AVAILABLE_COLORS = [
	{ name: 'Nogal', value: 'nogal', hex: '#7B4A12' },
	{ name: 'Blanco', value: 'blanco', hex: '#F5F5F5' },
	{ name: 'Negro', value: 'negro', hex: '#1A1A1A' },
	{ name: 'Gris', value: 'gris', hex: '#9CA3AF' },
	{ name: 'Café oscuro', value: 'cafe_oscuro', hex: '#4B2E1E' },
	{ name: 'Azul petróleo', value: 'azul_petroleo', hex: '#1F4E5F' },
	{ name: 'Verde oliva', value: 'verde_oliva', hex: '#556B2F' },
];


export default function CustomProductPage() {
	const router = useRouter();
	const { user } = useUser();
	const addItemMutation = useAddCustomItem();

	const [formData, setFormData] = useState({
		productName: '',
		description: '',
		dimensions: '',
		color: '',
		woodType: '',
		customWoodType: '',
		quantity: 1,
		referenceImage: null as File | null,
	});

	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData({ ...formData, referenceImage: file });
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const changeQty = (delta: number) => {
		setFormData({
			...formData,
			quantity: Math.max(1, formData.quantity + delta),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const Swal = (await import('sweetalert2')).default;

		if (!user) {
			Swal.fire({
				title: 'Inicia sesión',
				text: 'Debes iniciar sesión para solicitar productos personalizados',
				icon: 'warning',
				confirmButtonColor: '#8B5A2B',
			});
			router.push('/client/auth/login');
			return;
		}

		if (
			!formData.productName ||
			!formData.description ||
			!formData.dimensions ||
			!formData.color
		) {
			Swal.fire({
				title: 'Campos incompletos',
				text: 'Por favor completa todos los campos obligatorios',
				icon: 'warning',
				confirmButtonColor: '#8B5A2B',
			});
			return;
		}

		const woodType =
			formData.woodType === 'Otro (especificar)'
				? formData.customWoodType
				: formData.woodType;

		const detailedDescription = `
PRODUCTO PERSONALIZADO

Descripción: ${formData.description}
Dimensiones: ${formData.dimensions}
Tipo de madera: ${woodType || 'Por definir'}
Color: ${AVAILABLE_COLORS.find((c) => c.value === formData.color)?.name || formData.color}

${formData.referenceImage ? '✓ Imagen de referencia adjunta' : ''}
`.trim();

		try {
			const fd = new FormData();

			fd.append('name', formData.productName);
			fd.append('description', detailedDescription);
			fd.append('woodType', woodType || '');
			fd.append('color', formData.color);
			fd.append('size', formData.dimensions);
			fd.append('quantity', String(formData.quantity));

			if (formData.referenceImage) {
				fd.append('referenceImage', formData.referenceImage);
			}

			await addItemMutation.mutateAsync(fd);

			Swal.fire({
				title: '¡Solicitud enviada!',
				html: `
    <p>Tu producto personalizado ha sido agregado al carrito.</p>
    <p class="text-sm text-gray-600 mt-2">
        Nos pondremos en contacto contigo para confirmar detalles y cotización.
    </p>
`,
				icon: 'success',
				confirmButtonColor: '#8B5A2B',
			});

			// Limpiar formulario
			setFormData({
				productName: '',
				description: '',
				dimensions: '',
				color: '',
				woodType: '',
				customWoodType: '',
				quantity: 1,
				referenceImage: null,
			});
			setImagePreview(null);

			router.push('/client/productos/custom');
		} catch (error: any) {
			Swal.fire({
				title: 'Error',
				text: 'Hubo un problema al procesar tu solicitud',
				icon: 'error',
				confirmButtonColor: '#8B5A2B',
			});
			console.log(error);
		}
	};

	return (
		<section className='bg-[#FAF5EE] min-h-screen px-6 py-12'>
			<div className='max-w-6xl mx-auto'>
				{/* Back */}
				<button
					onClick={() => router.back()}
					className='flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B5A2B] mb-10'>
					<ArrowLeft size={16} />
					Volver a productos
				</button>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
					{/* Imagen de referencia */}
					<div className='space-y-4'>
						<div className='relative aspect-square rounded-2xl overflow-hidden bg-[#F2E8D9] shadow'>
							{imagePreview ? (
								<Image
									src={imagePreview}
									alt='Referencia'
									fill
									className='object-cover'
								/>
							) : (
								<div className='flex flex-col items-center justify-center h-full text-center p-8'>
									<Upload
										size={48}
										className='text-[#9A8F87] mb-4'
									/>
									<p className='text-sm text-[#9A8F87]'>
										Sube una imagen de referencia
										<br />
										<span className='text-xs'>(opcional)</span>
									</p>
								</div>
							)}
						</div>

						<label className='block'>
							<input
								type='file'
								accept='image/*'
								onChange={handleImageChange}
								className='hidden'
							/>
							<div className='cursor-pointer border-2 border-dashed border-[#D9CFCA] rounded-lg p-4 text-center hover:border-[#8B5A2B] transition'>
								<Upload
									size={20}
									className='mx-auto mb-2 text-[#8B5A2B]'
								/>
								<span className='text-xs text-[#9A8F87]'>
									{formData.referenceImage ? 'Cambiar imagen' : 'Subir imagen'}
								</span>
							</div>
						</label>
					</div>

					{/* Formulario */}
					<form
						onSubmit={handleSubmit}
						className='flex flex-col gap-8'>
						<div>
							<div className='flex items-center gap-2 mb-2'>
								<Sparkles
									size={16}
									className='text-[#C8973A]'
								/>
								<span className='text-xs tracking-[.22em] uppercase text-[#C8973A]'>
									Diseño personalizado
								</span>
							</div>
							<h1 className='font-serif text-3xl font-light'>Crea tu mueble ideal</h1>
						</div>

						<p className='text-sm leading-relaxed text-gray-600'>
							Completa los detalles de tu proyecto y nos pondremos en contacto contigo
							para confirmar la cotización y tiempos de entrega.
						</p>

						<hr className='border-[#D9CFCA]' />

						{/* Nombre del producto */}
						<div>
							<label className='text-xs uppercase tracking-widest font-medium block mb-2'>
								Nombre del mueble <span className='text-red-500'>*</span>
							</label>
							<input
								type='text'
								value={formData.productName}
								onChange={(e) =>
									setFormData({ ...formData, productName: e.target.value })
								}
								placeholder='Ej: Mesa de comedor rústica'
								className='w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#8B5A2B]'
								required
							/>
						</div>

						{/* Descripción */}
						<div>
							<label className='text-xs uppercase tracking-widest font-medium block mb-2'>
								Descripción <span className='text-red-500'>*</span>
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder='Describe el mueble que necesitas, material, tela, etc.'
								rows={4}
								className='w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#8B5A2B] resize-none'
								required
							/>
						</div>

						{/* Dimensiones */}
						<div>
							<label className='text-xs uppercase tracking-widest font-medium block mb-2'>
								Dimensiones (largo x ancho x alto)
								<span className='text-red-500'>*</span>
							</label>
							<input
								type='text'
								value={formData.dimensions}
								onChange={(e) =>
									setFormData({ ...formData, dimensions: e.target.value })
								}
								placeholder='Ej: 180cm x 90cm x 75cm (largo x ancho x alto)'
								className='w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#8B5A2B]'
								required
							/>
							<p className='text-xs text-gray-500 mt-1'>
								Especifica las medidas que necesitas
							</p>
						</div>

						{/* Color */}
						<div>
							<label className='text-xs uppercase tracking-widest font-medium block mb-2'>
								Color/Acabado <span className='text-red-500'>*</span>
							</label>
							<div className='flex flex-wrap gap-4'>
								{AVAILABLE_COLORS.map((c) => (
									<button
										key={c.value}
										type='button'
										onClick={() => setFormData({ ...formData, color: c.value })}
										className={`flex flex-col items-center gap-1 transition-transform ${
											formData.color === c.value ? 'scale-110' : ''
										}`}>
										<span
											className='w-8 h-8 rounded-full border-2'
											style={{
												backgroundColor: c.hex,
												borderColor:
													formData.color === c.value
														? '#8B5A2B'
														: '#D9CFCA',
											}}
										/>
										<span className='text-[10px] text-gray-500'>{c.name}</span>
									</button>
								))}
							</div>
						</div>

						{/* Cantidad */}
						<div>
							<label className='text-xs uppercase tracking-widest font-medium block mb-2'>
								Cantidad
							</label>
							<div className='flex items-center border rounded-lg w-fit'>
								<button
									type='button'
									onClick={() => changeQty(-1)}
									className='w-10 h-10 bg-[#F2E8D9] hover:bg-[#D9CFCA]'>
									−
								</button>
								<div className='w-12 text-center font-medium'>
									{formData.quantity}
								</div>
								<button
									type='button'
									onClick={() => changeQty(1)}
									className='w-10 h-10 bg-[#F2E8D9] hover:bg-[#D9CFCA]'>
									+
								</button>
							</div>
						</div>

						{/* Submit */}
						<button
							type='submit'
							disabled={addItemMutation.isPending}
							className='w-full bg-[#2C2420] hover:bg-[#5C3317] text-white py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'>
							{addItemMutation.isPending ? 'Procesando...' : 'Solicitar cotización'}
						</button>

						<p className='text-xs text-gray-500 text-center'>
							Nos pondremos en contacto contigo en las próximas 24 horas para
							confirmar detalles y enviarte una cotización personalizada.
						</p>
					</form>
				</div>
			</div>
		</section>
	);
}
