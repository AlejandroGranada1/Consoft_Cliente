'use client';

import { useState } from 'react';
import { Calendar, TimePicker, FormField, ServiceSelector } from '@/components/agenda';
import { useCreateVisit, useCreateVisitForMe } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

// helper SweetAlert2
const showAlert = async (config: any) => {
	const Swal = (await import('sweetalert2')).default;
	return Swal.fire(config);
};

export default function ScheduleSection() {
	const { user } = useUser();
	const isLogged = !!user;

	const createGuestVisit = useCreateVisitForMe();
	const createMyVisit = useCreateVisit();

	const [date, setDate] = useState<Date | undefined>(undefined);
	const [time, setTime] = useState<string | null>(null);
	const [description, setDescription] = useState('');
	const [service, setService] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [userName, setUserName] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [userPhone, setUserPhone] = useState('');
	const [userAddress, setUserAddress] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!date || !time || !service || !userAddress) {
			await showAlert({
				icon: 'warning',
				title: 'Campos incompletos',
				text: 'Por favor, completa todos los campos obligatorios.',
			});
			return;
		}

		if (!isLogged) {
			if (!userName || !userEmail || !userPhone) {
				await showAlert({
					icon: 'warning',
					title: 'Campos incompletos',
					text: 'Por favor, completa tu información de contacto.',
				});
				return;
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(userEmail)) {
				await showAlert({
					icon: 'warning',
					title: 'Email inválido',
					text: 'Por favor, ingresa un email válido.',
				});
				return;
			}
		}

		const basePayload = {
			visitDate: date,
			visitTime: time,
			address: userAddress.trim(),
			services: [service],
			description: description.trim() || undefined,
		};

		const payload = isLogged
			? basePayload
			: {
					...basePayload,
					userName: userName.trim(),
					userEmail: userEmail.trim(),
					userPhone: userPhone.trim(),
				};

		const result = await showAlert({
			title: '¿Confirmar visita?',
			html: `
        <div style="text-align:left;margin-top:1rem;">
          ${
				!isLogged
					? `
            <p><strong>Nombre:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Teléfono:</strong> ${userPhone}</p>
          `
					: `<p><strong>Solicitante:</strong> ${user?.name}</p>`
			}
          <p><strong>Dirección:</strong> ${userAddress}</p>
          <p><strong>Servicio:</strong> ${service}</p>
          <p><strong>Fecha:</strong> ${date.toLocaleDateString()}</p>
          <p><strong>Hora:</strong> ${time}</p>
        </div>
      `,
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Sí, agendar',
			cancelButtonText: 'Cancelar',
		});

		if (!result.isConfirmed) return;

		setIsSubmitting(true);

		try {
			if (isLogged) {
				await createMyVisit.mutateAsync(payload);
			} else {
				await createGuestVisit.mutateAsync(payload);
			}

			await showAlert({
				icon: 'success',
				title: 'Visita agendada',
				text: 'Tu visita ha sido creada exitosamente.',
				timer: 2000,
				showConfirmButton: false,
			});

			setDate(undefined);
			setTime(null);
			setDescription('');
			setService('');
			setUserName('');
			setUserEmail('');
			setUserPhone('');
			setUserAddress('');
		} catch (error) {
			await showAlert({
				icon: 'error',
				title: 'Error',
				text: 'Hubo un problema al crear la visita.',
			});
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className='py-10 px-4 bg-[#fff9f6]'>
			<h2 className='text-2xl md:text-3xl font-bold text-center mb-1 text-gray-900'>
				Agenda tu visita
			</h2>
			<p className='text-center text-gray-700 mb-6'>
				Completa el formulario para agendar tu visita
			</p>

			<form
				onSubmit={handleSubmit}
				className='bg-white shadow-lg rounded-2xl p-5 md:p-8 grid grid-cols-1 gap-6 max-w-4xl mx-auto'>
				{/* Información contacto solo si NO está logueado */}
				{!isLogged && (
					<div className='border-b pb-4'>
						<h3 className='text-lg font-bold text-gray-800 mb-4'>
							Información de contacto
						</h3>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<input
								type='text'
								placeholder='Nombre completo'
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								className='input'
								required
							/>
							<input
								type='email'
								placeholder='Email'
								value={userEmail}
								onChange={(e) => setUserEmail(e.target.value)}
								className='input'
								required
							/>
							<input
								type='tel'
								placeholder='Teléfono'
								value={userPhone}
								onChange={(e) => setUserPhone(e.target.value)}
								className='input'
								required
							/>
							<input
								type='text'
								placeholder='Dirección'
								value={userAddress}
								onChange={(e) => setUserAddress(e.target.value)}
								className='input'
								required
							/>
						</div>
					</div>
				)}

				{/* Dirección si está logueado */}
				{isLogged && (
					<div>
						<input
							type='text'
							placeholder='Dirección'
							value={userAddress}
							onChange={(e) => setUserAddress(e.target.value)}
							className='input'
							required
						/>
					</div>
				)}

				<ServiceSelector
					value={service}
					onSelect={setService}
				/>

				<Calendar
					value={date}
					onChange={setDate}
				/>
				<TimePicker
					selectedTime={time}
					onSelect={setTime}
				/>

				<FormField
					label=''
					placeholder='Descripción opcional...'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>

				<button
					type='submit'
					disabled={isSubmitting}
					className='bg-[#8B5E3C] text-white px-8 py-3 rounded-lg'>
					{isSubmitting ? 'Agendando...' : 'Agendar Visita'}
				</button>
			</form>
		</section>
	);
}
