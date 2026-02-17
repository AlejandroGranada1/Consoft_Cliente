'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, TimePicker, FormField, ServiceSelector } from '@/components/agenda';
import { useCreateVisit } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

// ✅ Función helper para cargar SweetAlert2 solo cuando se necesita
const showAlert = async (config: any) => {
	const Swal = (await import('sweetalert2')).default;
	return Swal.fire(config);
};

export default function ScheduleSection() {
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [time, setTime] = useState<string | null>(null);
	const [description, setDescription] = useState('');
	const [service, setService] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { user } = useUser();
	const addVisit = useCreateVisit();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!date || !time || !service) {
			await showAlert({
				icon: 'warning',
				title: 'Campos incompletos',
				text: 'Por favor, completa todos los campos obligatorios.',
			});
			return;
		}

		const payload = {
			user: user?.id!,
			visitDate: date,
			address: user?.address!,
			status: 'Pendiente',
			services: service,
		};

		const result = await showAlert({
			title: '¿Confirmar visita?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Sí, agendar',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
		});

		if (!result.isConfirmed) return;

		setIsSubmitting(true);

		try {
			await addVisit.mutateAsync(payload);

			await showAlert({
				icon: 'success',
				title: 'Visita agendada',
				text: 'Tu visita ha sido creada exitosamente.',
				timer: 1500,
				showConfirmButton: false,
			});

			// Reset form
			setDate(undefined);
			setTime(null);
			setDescription('');
			setService('');
		} catch (error) {
			await showAlert({
				icon: 'error',
				title: 'Error',
				text: `No se pudo agendar la visita. ${error.response.data.message}`,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="relative py-10 px-4 bg-[#fff9f6] overflow-hidden">
			{/* CONTENIDO */}
			<div className={`${!user ? 'blur-sm pointer-events-none select-none' : ''}`}>
				<h2 className="text-2xl md:text-3xl font-bold text-center mb-1 text-gray-900">
					Agenda tu visita
				</h2>
				<p className="text-center text-gray-700 mb-6">
					Elige la fecha, hora y servicio que más te convenga
				</p>

			<form
				onSubmit={handleSubmit}
				className='bg-white shadow-lg rounded-2xl p-5 md:p-8 grid grid-cols-1 gap-6 max-w-4xl mx-auto'>
				<div>
					<h3 className='text-base font-semibold text-gray-800 mb-2'>
						Selecciona el servicio
					</h3>
					<ServiceSelector
						value={service}
						onSelect={setService}
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<h3 className="text-base font-semibold text-gray-800 mb-2">
							Selecciona el servicio
						</h3>
						<Calendar
							value={date}
							onChange={setDate}
							className='mx-auto'
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-base font-semibold text-gray-800 mb-2">
								Selecciona la fecha
							</h3>
							<Calendar value={date} onChange={setDate} className="mx-auto" />
						</div>

						<img
							src='/Agenda.png'
							alt='Ilustración agenda'
							width={140}
							height={140}
							loading='lazy'
							className='mt-6 opacity-95'
						/>
					</div>
				</div>

				<div>
					<h3 className='text-base font-semibold text-gray-800 mb-2'>
						Añade una descripción (opcional)
					</h3>
					<FormField
						label=''
						placeholder='Añade una descripción'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className='flex justify-center'>
					<button
						type='submit'
						disabled={isSubmitting}
						className='bg-[#8B5E3C] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-[#734a2e] transition disabled:opacity-50 disabled:cursor-not-allowed'>
						{isSubmitting ? 'Agendando...' : 'Agendar'}
					</button>
				</div>
			</form>
		</section>
	);
}