'use client';
import { DefaultModalProps, Service } from '@/app/types';
import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

function EditServiceModal({ isOpen, onClose, extraProps }: DefaultModalProps<Service>) {
	const [serviceData, setServiceData] = useState<Service>({
		id: '',
		name: '',
		description: '',
		imageUrl: '',
		status: true,
	});

	// 🔹 Prellenar datos cuando se abre el modal
	useEffect(() => {
		if (extraProps) {
			setServiceData(extraProps);
		}
	}, [extraProps, isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setServiceData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Categoría actualizada:', serviceData);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>EDITAR SERVICIO</h1>
				</header>
				<section className='grid grid-cols-2 gap-4'>
					<form onSubmit={handleSubmit}>
						{/* Nombre */}
						<div className='flex flex-col'>
							<label htmlFor='name'>Producto</label>
							<input
								id='name'
								name='name'
								type='text'
								value={serviceData.name}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>
						{/* Descripción */}
						<div className='flex flex-col mt-4'>
							<label htmlFor='description'>Descripción</label>
							<input
								id='description'
								name='description'
								type='text'
								value={serviceData.description}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>
						<div className='flex flex-col mt-4'>
							<label htmlFor='description'>Imagen</label>
							<input
								id='description'
								name='description'
								type='file'
								placeholder='Descripción de la categoría'
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>

						{/* Estado */}
						<div className='flex items-center gap-3 mt-4'>
							<input
								id='status'
								name='status'
								type='checkbox'
								checked={serviceData.status}
								onChange={(e) =>
									setServiceData((prev) => ({
										...prev,
										status: e.target.checked,
									}))
								}
								className='h-4 w-4 cursor-pointer'
							/>
							<span
								className={serviceData.status ? 'text-green-600' : 'text-red-600'}>
								{serviceData.status ? 'Activo' : 'Inactivo'}
							</span>
						</div>

						{/* Botones */}
					</form>
					<div className='border rounded-lg'></div>
				</section>
				<div className='w-full flex justify-between mt-10'>
					<button
						type='submit'
						className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
						Guardar
					</button>
					<button
						type='button'
						onClick={onClose}
						className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);
}

export default EditServiceModal;
