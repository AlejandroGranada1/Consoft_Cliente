import { DefaultModalProps, Service } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

function CreateServiceModal({ isOpen, onClose, extraProps }: DefaultModalProps<Service>) {
	const [serviceData, setServiceData] = useState<Service>({
		id: '',
		name: '',
		description: '',
		imageUrl: '',
		status: true,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setServiceData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		console.log('Categoría creada:', serviceData);

		// Reinicia el formulario
		setServiceData({
			id: '',
			name: '',
			description: '',
			imageUrl: '',
			status: true,
		});

		onClose();
	};

	if (!isOpen) return;
	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>Agregar Servicio</h1>
				</header>

				<section className='grid grid-cols-2 gap-4'>
					<form
						onSubmit={handleSubmit}
						className='flex flex-col  justify-between gap-4'>
						{/* Nombre */}
						<div className='flex flex-col'>
							<label htmlFor='name'>Servicio</label>
							<input
								id='name'
								name='name'
								type='text'
								placeholder='Nombre del producto'
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
								placeholder='Descripción de la categoría'
								value={serviceData.description}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>
						{/* Imagen */}
						<div className='flex flex-col mt-4'>
							<label htmlFor='description'>Imagen</label>
							<input
								id='description'
								name='description'
								type='file'
								placeholder='Descripción de la categoría'
								value={serviceData.imageUrl}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>
					</form>
					{/* Preview de la imagen */}
					<div className='border rounded-lg'></div>
				</section>
				{/* Botones */}
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

export default CreateServiceModal;
