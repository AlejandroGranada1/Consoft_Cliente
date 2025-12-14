'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, TimePicker, FormField, ServiceSelector } from '@/components/agenda';
import { useAddVisit } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

export default function ScheduleSection() {
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [time, setTime] = useState<string | null>(null);
	const [description, setDescription] = useState('');
	const [service, setService] = useState<string>('');

	const { user, loading } = useUser();
	const router = useRouter();
	const addVisit = useAddVisit();

	useEffect(() => {
		if (loading) return; // ⛔ aún validando sesión

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

	if (user === undefined || user === null) return null;

	const resetForm = () => {
		setDate(undefined);
		setTime(null);
		setDescription('');
		setService('');
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!date || !time || !service) {
			// alerta campos incompletos
			return;
		}

		if (!user.address) {
			const Swal = (await import('sweetalert2')).default;

			await Swal.fire({
				icon: 'warning',
				title: 'Dirección requerida',
				text: 'Debes registrar una dirección antes de agendar una visita.',
			});

			return;
		}

		const payload = {
			user: user.id,
			visitDate: date,
			address: user.address,
			status: 'Pendiente',
			services: service,
			description,
		};

		const Swal = (await import('sweetalert2')).default;

		const result = await Swal.fire({
			title: '¿Confirmar visita?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Sí, agendar',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
		});

		if (!result.isConfirmed) return;

		try {
			await addVisit.mutateAsync(payload);

			await Swal.fire({
				icon: 'success',
				title: 'Visita agendada',
				text: 'Tu visita ha sido creada exitosamente.',
				timer: 1500,
				showConfirmButton: false,
			});
			resetForm()
		} catch {
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Hubo un problema al crear la visita.',
			});
		}
	};

	return (
		<section className='py-10 px-4 bg-[#fff9f4]'>
			<h2 className='text-2xl md:text-3xl font-bold text-center mb-1 text-gray-900'>
				Agenda tu visita
			</h2>

			<p className='text-center text-gray-700 mb-6'>
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
						<h3 className='text-base font-semibold text-gray-800 mb-2'>
							Selecciona la fecha
						</h3>

						<Calendar
							value={date}
							onChange={setDate}
							className='mx-auto'
						/>
					</div>

					<div className='flex flex-col items-center'>
						<div className='w-full'>
							<h3 className='text-base font-semibold text-gray-800 mb-2'>
								Selecciona la hora
							</h3>

							<TimePicker
								selectedTime={time}
								onSelect={setTime}
							/>
						</div>

						<img
							src='/Agenda.png'
							alt='Ilustración agenda'
							className='max-w-[140px] mt-6 opacity-95'
						/>
					</div>
				</div>

				<div>
					<h3 className='text-base font-semibold text-gray-800 mb-2'>
						Añade una descripción
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
						className='bg-[#8B5E3C] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-[#734a2e] transition'>
						Agendar
					</button>
				</div>
			</form>
		</section>
	);
}
