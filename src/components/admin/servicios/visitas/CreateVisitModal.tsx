'use client';
import { X, User, MapPin, Calendar, Clock, CheckSquare, Plus, Minus, Save, AlertCircle } from 'lucide-react';
import { DefaultModalProps, Visit, Service, User as UserType } from '@/lib/types';
import React, { useState } from 'react';
import { useGetUsers, useGetServices } from '@/hooks/apiHooks';
import { useCreateVisit } from '@/hooks/apiHooks';
import { createPortal } from 'react-dom';

const AVAILABLE_TIMES = [
	'08:00', '09:00', '10:00', '11:00', '12:00',
	'13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

function CreateVisitModal({ isOpen, onClose, updateList }: DefaultModalProps<Visit>) {
	const { data: usersData, isLoading: usersLoading } = useGetUsers();
	const { data: servicesData, isLoading: servicesLoading } = useGetServices();
	const createVisitMutation = useCreateVisit();

	const users = usersData?.users || [];
	const services = servicesData?.services || [];

	const [visitData, setVisitData] = useState({
		user: '',
		address: '',
		visitDate: new Date().toISOString().split('T')[0],
		scheduledTime: '10:00',
		status: 'Programada',
		notes: '',
		services: [] as string[],
		selectedServices: [] as Array<{
			id: string;
			name: string;
			description?: string;
		}>,
	});

	const [customService, setCustomService] = useState('');
	const selectedUser = users.find((u: UserType) => u._id === visitData.user);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setVisitData((prev) => ({
			...prev,
			[name]: value,
			...(name === 'user' && selectedUser?.address ? { address: selectedUser.address } : {}),
		}));
	};

	const handleServiceToggle = (serviceId: string) => {
		setVisitData((prev) => {
			const service = services.find((s: Service) => s._id === serviceId);
			if (!service) return prev;

			const isAlreadySelected = prev.services.includes(serviceId);

			if (isAlreadySelected) {
				return {
					...prev,
					services: prev.services.filter((id) => id !== serviceId),
					selectedServices: prev.selectedServices.filter((s) => s.id !== serviceId),
				};
			} else {
				return {
					...prev,
					services: [...prev.services, serviceId],
					selectedServices: [
						...prev.selectedServices,
						{
							id: service._id!,
							name: service.name,
							description: service.description,
						},
					],
				};
			}
		});
	};

	const handleAddCustomService = () => {
		if (!customService.trim()) return;

		const customServiceObj = {
			id: `custom-${Date.now()}`,
			name: customService,
			description: 'Servicio personalizado',
		};

		setVisitData((prev) => ({
			...prev,
			services: [...prev.services, customServiceObj.id],
			selectedServices: [...prev.selectedServices, customServiceObj],
		}));

		setCustomService('');
	};

	const removeSelectedService = (serviceId: string) => {
		setVisitData((prev) => ({
			...prev,
			services: prev.services.filter((id) => id !== serviceId),
			selectedServices: prev.selectedServices.filter((s) => s.id !== serviceId),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!visitData.user) {
			const Swal = (await import('sweetalert2')).default;
			return Swal.fire({
				title: 'Campo requerido',
				text: 'Por favor selecciona un cliente',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		if (!visitData.address) {
			const Swal = (await import('sweetalert2')).default;
			return Swal.fire({
				title: 'Campo requerido',
				text: 'Por favor ingresa una dirección',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		if (!visitData.visitDate) {
			const Swal = (await import('sweetalert2')).default;
			return Swal.fire({
				title: 'Campo requerido',
				text: 'Por favor selecciona una fecha',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		try {
			const scheduledDateTime = `${visitData.visitDate}T${visitData.scheduledTime}:00`;

			const visitToCreate = {
				user: visitData.user,
				address: visitData.address,
				visitDate: scheduledDateTime,
				status: visitData.status,
				notes: visitData.notes || undefined,
				services: visitData.services,
				customServices: visitData.selectedServices
					.filter((s) => s.id.startsWith('custom-'))
					.map((s) => s.name),
			};

			await createVisitMutation.mutateAsync(visitToCreate);

			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Visita programada exitosamente',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});

			setVisitData({
				user: '',
				address: '',
				visitDate: new Date().toISOString().split('T')[0],
				scheduledTime: '10:00',
				status: 'Programada',
				notes: '',
				services: [],
				selectedServices: [],
			});
			setCustomService('');

			onClose();
			if (updateList) updateList();
		} catch (error) {
			console.error('Error al crear visita:', error);
			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				title: 'Error',
				text: 'No se pudo crear la visita',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		}
	};

	if (!isOpen) return null;

	return createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
			
			<div className="w-full max-w-3xl rounded-2xl border border-white/10
				shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
				style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
				
				{/* Header */}
				<header className="relative px-6 py-5 border-b border-white/10">
					<button
						onClick={onClose}
						className="absolute right-4 top-1/2 -translate-y-1/2
							p-2 rounded-lg text-white/40 hover:text-white/70
							hover:bg-white/5 transition-all duration-200">
						<X size={18} />
					</button>
					<h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
						<MapPin size={18} className="text-[#C8A882]" />
						Programar nueva visita
					</h2>
					<p className="text-center text-white/40 text-xs mt-1">
						Programa una visita para tomar medidas o realizar servicios
					</p>
				</header>

				<form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">

					{/* Información del cliente */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
							<User size={16} className="text-[#C8A882]" />
							Información del cliente *
						</h3>

						<div className="space-y-2">
							<select
								name="user"
								value={visitData.user}
								onChange={handleChange}
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200 appearance-none"
								required
								disabled={usersLoading}>
								<option value="" className="bg-[#1e1e1c]">Seleccione un cliente</option>
								{usersLoading ? (
									<option value="" disabled className="bg-[#1e1e1c]">Cargando...</option>
								) : (
									users.map((user: UserType) => (
										<option key={user._id} value={user._id} className="bg-[#1e1e1c]">
											{user.name} - {user.email}
										</option>
									))
								)}
							</select>

							{selectedUser && (
								<div className="mt-3 p-3 rounded-lg bg-[#C8A882]/10 border border-[#C8A882]/20">
									<div className="grid grid-cols-2 gap-3 text-xs">
										<div>
											<p className="text-white/40">Nombre</p>
											<p className="text-white/90 font-medium">{selectedUser.name}</p>
										</div>
										<div>
											<p className="text-white/40">Teléfono</p>
											<p className="text-white/90">{selectedUser.phone || 'No registrado'}</p>
										</div>
										<div className="col-span-2">
											<p className="text-white/40">Email</p>
											<p className="text-white/90">{selectedUser.email}</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Dirección */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
							<MapPin size={16} className="text-[#C8A882]" />
							Dirección de la visita *
						</h3>

						<div className="space-y-2">
							<textarea
								name="address"
								placeholder="Ingresa la dirección completa donde se realizará la visita"
								value={visitData.address}
								onChange={handleChange}
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200 resize-none"
								rows={3}
								required
							/>

							{selectedUser?.address && visitData.address !== selectedUser.address && (
								<div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
									<p className="text-xs text-yellow-400 flex items-center gap-1">
										<AlertCircle size={12} />
										Dirección difiere de la registrada: {selectedUser.address}
									</p>
									<button
										type="button"
										onClick={() => setVisitData((prev) => ({ ...prev, address: selectedUser.address! }))}
										className="text-xs text-[#C8A882] hover:underline mt-1">
										Usar dirección registrada
									</button>
								</div>
							)}

							<div className="mt-3">
								<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block mb-2">
									Notas adicionales
								</label>
								<textarea
									name="notes"
									placeholder="Instrucciones especiales, referencias, etc."
									value={visitData.notes}
									onChange={handleChange}
									className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
										text-sm text-white placeholder:text-white/30
										focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
										transition-all duration-200 resize-none"
									rows={2}
								/>
							</div>
						</div>
					</div>

					{/* Fecha y hora */}
					<div className="grid grid-cols-2 gap-4">
						<div className="rounded-xl border border-white/10 bg-white/5 p-4">
							<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
								<Calendar size={16} className="text-[#C8A882]" />
								Fecha *
							</h3>
							<input
								type="date"
								name="visitDate"
								value={visitData.visitDate}
								onChange={handleChange}
								min={new Date().toISOString().split('T')[0]}
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
								required
							/>
						</div>

						<div className="rounded-xl border border-white/10 bg-white/5 p-4">
							<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
								<Clock size={16} className="text-[#C8A882]" />
								Hora *
							</h3>
							<select
								name="scheduledTime"
								value={visitData.scheduledTime}
								onChange={handleChange}
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200 appearance-none"
								required>
								{AVAILABLE_TIMES.map((time) => (
									<option key={time} value={time} className="bg-[#1e1e1c]">
										{time} horas
									</option>
								))}
							</select>
							<p className="text-xs text-white/30 mt-2">Horario: 8:00 AM - 6:00 PM</p>
						</div>
					</div>

					{/* Servicios */}
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
							<CheckSquare size={16} className="text-[#C8A882]" />
							Servicios requeridos
						</h3>

						<p className="text-xs text-white/40 mb-4">
							Selecciona los servicios que se realizarán en la visita (opcional)
						</p>

						{servicesLoading ? (
							<div className="text-center py-4">
								<p className="text-white/30">Cargando servicios...</p>
							</div>
						) : (
							<div className="grid grid-cols-2 gap-3 mb-6 max-h-60 overflow-y-auto pr-2">
								{services.slice(0, 8).map((service: Service) => (
									<button
										key={service._id}
										type="button"
										onClick={() => handleServiceToggle(service._id!)}
										className={`p-3 rounded-xl border transition-all duration-200 text-left ${
											visitData.services.includes(service._id!)
												? 'bg-[#C8A882]/10 border-[#C8A882]/50'
												: 'bg-white/5 border-white/10 hover:bg-white/8'
										}`}>
										<div className="flex items-start gap-2">
											<input
												type="checkbox"
												checked={visitData.services.includes(service._id!)}
												onChange={() => {}}
												className="mt-1 w-3.5 h-3.5 rounded border-white/30 bg-white/5 text-[#C8A882] focus:ring-[#C8A882]"
											/>
											<div>
												<p className="text-xs font-medium text-white">{service.name}</p>
												{service.description && (
													<p className="text-[10px] text-white/40 mt-1 truncate max-w-[150px]">
														{service.description.substring(0, 40)}...
													</p>
												)}
											</div>
										</div>
									</button>
								))}
							</div>
						)}

						{/* Servicios personalizados */}
						<div className="mt-4">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block mb-2">
								Agregar servicio personalizado
							</label>
							<div className="flex gap-2">
								<input
									type="text"
									value={customService}
									onChange={(e) => setCustomService(e.target.value)}
									placeholder="Ej: Medidas para closet, cotización mueble, etc."
									className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3
										text-sm text-white placeholder:text-white/30
										focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
										transition-all duration-200"
								/>
								<button
									type="button"
									onClick={handleAddCustomService}
									disabled={!customService.trim()}
									className="px-4 py-3 rounded-xl
										bg-[#8B5E3C] hover:bg-[#6F452A]
										text-white text-sm font-medium
										disabled:opacity-50 disabled:cursor-not-allowed
										flex items-center gap-2
										transition-all duration-200">
									<Plus size={14} />
								</button>
							</div>
						</div>

						{/* Servicios seleccionados */}
						{visitData.selectedServices.length > 0 && (
							<div className="mt-4">
								<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block mb-2">
									Servicios seleccionados ({visitData.selectedServices.length})
								</label>
								<div className="space-y-2 max-h-40 overflow-y-auto pr-2">
									{visitData.selectedServices.map((service) => (
										<div key={service.id}
											className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
											<div>
												<p className="text-xs font-medium text-white">{service.name}</p>
												{service.description && (
													<p className="text-[10px] text-white/40">{service.description}</p>
												)}
											</div>
											<button
												type="button"
												onClick={() => removeSelectedService(service.id)}
												className="p-1 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition">
												<Minus size={14} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Estado */}
					<div className="space-y-2">
						<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
							Estado inicial de la visita
						</label>
						<select
							name="status"
							value={visitData.status}
							onChange={handleChange}
							className="w-64 rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white
								focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
								transition-all duration-200 appearance-none">
							<option value="Programada" className="bg-[#1e1e1c]">Programada</option>
							<option value="Confirmada" className="bg-[#1e1e1c]">Confirmada</option>
							<option value="En camino" className="bg-[#1e1e1c]">En camino</option>
						</select>
					</div>

					{/* Resumen */}
					{selectedUser && (
						<div className="p-4 rounded-xl bg-[#C8A882]/10 border border-[#C8A882]/20">
							<h4 className="text-sm font-medium text-[#C8A882] mb-2">Resumen de la visita</h4>
							<div className="grid grid-cols-2 gap-4 text-xs">
								<div>
									<p className="text-white/40">Cliente:</p>
									<p className="text-white/90 font-medium">{selectedUser.name}</p>
								</div>
								<div>
									<p className="text-white/40">Fecha y hora:</p>
									<p className="text-white/90">
										{new Date(visitData.visitDate).toLocaleDateString('es-CO')} - {visitData.scheduledTime}
									</p>
								</div>
								<div className="col-span-2">
									<p className="text-white/40">Dirección:</p>
									<p className="text-white/90">{visitData.address || 'No ingresada'}</p>
								</div>
								{visitData.selectedServices.length > 0 && (
									<div className="col-span-2">
										<p className="text-white/40">Servicios:</p>
										<p className="text-white/90">
											{visitData.selectedServices.map(s => s.name).join(', ')}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Botones */}
					<div className="flex justify-end gap-3 pt-4 border-t border-white/10">
						<button
							type="button"
							onClick={onClose}
							className="px-5 py-2.5 rounded-lg
								border border-white/15 bg-white/5
								text-white/70 text-sm
								hover:bg-white/10 hover:text-white
								transition-all duration-200">
							Cancelar
						</button>
						<button
							type="submit"
							disabled={createVisitMutation.isPending || !visitData.user || !visitData.address || !visitData.visitDate}
							className="px-5 py-2.5 rounded-lg
								bg-[#8B5E3C] hover:bg-[#6F452A]
								text-white text-sm font-medium
								shadow-lg shadow-[#8B5E3C]/20
								disabled:opacity-50 disabled:cursor-not-allowed
								flex items-center gap-2
								transition-all duration-200">
							{createVisitMutation.isPending ? (
								<>
									<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
									Programando...
								</>
							) : (
								<>
									<Save size={14} />
									Programar Visita
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body
	);
}

export default CreateVisitModal;