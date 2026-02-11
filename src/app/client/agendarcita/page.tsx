'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, TimePicker, FormField, ServiceSelector } from '@/components/agenda';
import { useCreateVisit } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import Swal from 'sweetalert2';

export default function ScheduleSection() {
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [time, setTime] = useState<string | null>(null);
	const [description, setDescription] = useState('');
	const [service, setService] = useState<string>('');

	const { user } = useUser();
	const addVisit = useCreateVisit();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!date || !time || !service) {
			Swal.fire({
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

			Swal.fire({
				icon: 'success',
				title: 'Visita agendada',
				text: 'Tu visita ha sido creada exitosamente.',
				timer: 1500,
				showConfirmButton: false,
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Hubo un problema al crear la visita.',
			});
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
					className="bg-white shadow-lg rounded-2xl p-5 md:p-8 grid grid-cols-1 gap-6 max-w-4xl mx-auto"
				>
					<div>
						<h3 className="text-base font-semibold text-gray-800 mb-2">
							Selecciona el servicio
						</h3>
						<ServiceSelector value={service} onSelect={setService} />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-base font-semibold text-gray-800 mb-2">
								Selecciona la fecha
							</h3>
							<Calendar value={date} onChange={setDate} className="mx-auto" />
						</div>

						<div className="flex flex-col items-center">
							<div className="w-full">
								<h3 className="text-base font-semibold text-gray-800 mb-2">
									Selecciona la hora
								</h3>
								<TimePicker selectedTime={time} onSelect={setTime} />
							</div>

							<img
								src="/Agenda.png"
								alt="Ilustración agenda"
								className="max-w-[140px] mt-6 opacity-95"
							/>
						</div>
					</div>

					<div>
						<h3 className="text-base font-semibold text-gray-800 mb-2">
							Añade una descripción
						</h3>
						<FormField
							label=""
							placeholder="Añade una descripción"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="flex justify-center">
						<button
							type="submit"
							className="bg-[#8B5E3C] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-[#734a2e] transition"
						>
							Agendar
						</button>
					</div>
				</form>
			</div>

			{/* OVERLAY LOGIN */}
			{!user && (
				<div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
					<div
						className="
							bg-white rounded-2xl p-6 md:p-8 text-center
							max-w-sm w-full shadow-2xl
							-transform -translate-y-20
						"
					>
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Inicia sesión
						</h3>
						<p className="text-gray-600 mb-6">
							Para agendar una visita necesitas estar logeado
						</p>

						<Link
							href="/client/auth/login"
							className="block bg-[#8B5E3C] text-white py-2 rounded-lg font-medium hover:bg-[#734a2e] transition mb-3"
						>
							Iniciar sesión
						</Link>

						<Link
							href="/client/auth/register"
							className="block text-[#8B5E3C] font-medium hover:underline"
						>
							¿No tienes cuenta? Regístrate
						</Link>
					</div>
				</div>
			)}
		</section>
	);
}