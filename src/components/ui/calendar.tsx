// components/ui/DatePicker.tsx
'use client';

import { useState } from 'react';
import {
	format,
	isSameDay,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isBefore,
	startOfToday,
	isToday,
} from 'date-fns';

interface DatePickerProps {
	value?: Date;
	onChange: (date: Date) => void;
	className?: string;
}

export default function DatePicker({ value, onChange, className = '' }: DatePickerProps) {
	const today = startOfToday(); // ✅ Fecha de hoy (inicio del día)
	const [selectedDate, setSelectedDate] = useState(value || today);
	const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

	const handleDateClick = (date: Date) => {
		// ✅ Solo permite seleccionar si es hoy o futuro
		if (isBefore(date, today)) return;

		setSelectedDate(date);
		onChange(date);
	};

	const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
	const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

	const daysInMonth = eachDayOfInterval({
		start: startOfMonth(currentMonth),
		end: endOfMonth(currentMonth),
	});

	return (
		<div className={`relative ${className}`}>
			<div className='flex justify-between items-center mb-2'>
				<button
					type='button'
					onClick={handlePrevMonth}
					className='text-xl text-gray-600 hover:text-gray-800 transition'>
					←
				</button>
				<span className='text-lg font-semibold'>{format(currentMonth, 'MMMM yyyy')}</span>
				<button
					type='button'
					onClick={handleNextMonth}
					className='text-xl text-gray-600 hover:text-gray-800 transition'>
					→
				</button>
			</div>

			<div className='grid grid-cols-7 gap-1 text-center'>
				{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
					<div
						key={day}
						className='text-sm font-semibold text-gray-500'>
						{day}
					</div>
				))}

				{daysInMonth.map((day) => {
					const isPast = isBefore(day, today);
					const isSelected = isSameDay(day, selectedDate);
					const isTodayDate = isToday(day);

					return (
						<button
							type='button'
							key={day.toString()}
							onClick={() => handleDateClick(day)}
							disabled={isPast} // ✅ Deshabilita fechas pasadas
							className={`py-2 px-3 rounded-full w-full text-sm transition ${
								isPast
									? 'text-gray-300 cursor-not-allowed' // ✅ Estilo para fechas pasadas
									: isSelected
										? 'bg-blue-500 text-white'
										: isTodayDate
											? 'bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200'
											: 'hover:bg-gray-200 text-gray-800'
							}`}>
							{format(day, 'd')}
						</button>
					);
				})}
			</div>

			<input
				type='date'
				value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
				onChange={(e) => handleDateClick(new Date(e.target.value))}
				min={format(today, 'yyyy-MM-dd')} // ✅ Bloquea fechas pasadas en input nativo
				className='mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
			/>
		</div>
	);
}
