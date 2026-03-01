'use client';

import { X, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { DefaultModalProps, Visit } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, TimePicker } from '@/components/agenda';
import { useGetAvailableSlots } from '@/hooks/useVisits';
import { format } from 'date-fns';
import api from '@/components/Global/axios';
import { updateElement } from '../../global/alerts';

function EditVisitModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Visit>) {
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [time, setTime] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const formattedDateStr = date ? format(date, 'yyyy-MM-dd') : undefined;
	const { data: slotsData, isLoading: isLoadingSlots } = useGetAvailableSlots(formattedDateStr);

	useEffect(() => {
		if (extraProps && isOpen) {
			setDate(new Date(extraProps.visitDate));
			setTime(extraProps.visitTime);
		}
	}, [extraProps, isOpen]);

	const handleDateChange = (newDate: Date | undefined) => {
		setDate(newDate);
		setTime(null); // Reset time when date changes
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!date || !time || !extraProps?._id) return;

		setIsSubmitting(true);
		try {
			const payload = {
				...extraProps,
				visitDate: format(date, 'yyyy-MM-dd'),
				visitTime: time,
			};

			await updateElement(
				'Visita',
				`/api/visits/${extraProps._id}`,
				payload,
				updateList
			);

			onClose();
		} catch (error) {
			console.error('Error updating visit:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return createPortal(
		<div
			className='fixed inset-0 z-[60] flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
			<div
				className='w-full max-w-2xl rounded-2xl border border-white/10
				shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden'
				style={{ background: 'rgba(30,30,28,0.98)', backdropFilter: 'blur(20px)' }}>

				<header className='px-6 py-5 border-b border-white/10 flex items-center justify-between'>
					<h2 className='text-lg font-medium text-white flex items-center gap-2'>
						<CalendarIcon size={18} className='text-[#C8A882]' />
						Reprogramar visita
					</h2>
					<button
						onClick={onClose}
						className='p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all'>
						<X size={18} />
					</button>
				</header>

				<form onSubmit={handleSubmit} className='p-6 space-y-6 overflow-y-auto max-h-[80vh]'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Calendar */}
						<div className='flex flex-col h-full'>
							<p className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-3'>
								Nueva fecha
							</p>
							<div className='rounded-xl border border-white/10 bg-white/5 overflow-hidden flex-1'>
								<Calendar
									value={date}
									onChange={handleDateChange}
									className='bg-transparent border-0'
								/>
							</div>
						</div>

						{/* Time Picker */}
						<div className='flex flex-col'>
							<p className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-3'>
								Nuevo horario
							</p>
							<div className='min-h-[250px] max-h-[350px] overflow-y-auto pr-2'>
								<TimePicker
									selectedTime={time}
									onSelect={setTime}
									availableSlots={slotsData?.availableSlots}
									isLoading={isLoadingSlots}
								/>
							</div>

							{slotsData?.availableSlots?.length === 0 && !isLoadingSlots && date && (
								<div className='mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-xs'>
									<AlertCircle size={14} />
									No hay horarios disponibles para esta fecha.
								</div>
							)}
						</div>
					</div>

					<div className='p-4 rounded-xl bg-white/5 border border-white/10'>
						<p className='text-xs text-white/40 mb-2'>Información de la visita:</p>
						<p className='text-sm text-white/80'>
							<span className='font-medium text-white'>Cliente:</span> {extraProps?.isGuest ? extraProps.guestInfo?.name : extraProps?.user?.name}
						</p>
						<p className='text-sm text-white/80 truncate'>
							<span className='font-medium text-white'>Dirección:</span> {extraProps?.address}
						</p>
					</div>

					<footer className='flex justify-end gap-3 pt-4 border-t border-white/10'>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2.5 rounded-lg border border-white/15 bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-all'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={isSubmitting || !date || !time}
							className='px-8 py-2.5 rounded-lg bg-[#8B5E3C] hover:bg-[#6F452A] disabled:opacity-50 text-white text-sm font-medium transition-all shadow-lg'>
							{isSubmitting ? 'Guardando...' : 'Guardar cambios'}
						</button>
					</footer>
				</form>
			</div>
		</div>,
		document.body
	);
}

export default EditVisitModal;
