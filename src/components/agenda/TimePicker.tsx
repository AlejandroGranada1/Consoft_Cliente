'use client';

import * as React from 'react';

interface TimePickerProps {
	selectedTime: string | null;
	onSelect: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ selectedTime, onSelect }) => {
	const times = [
		{ label: '8:00 AM', value: '08:00' },
		{ label: '9:00 AM', value: '09:00' },
		{ label: '10:00 AM', value: '10:00' },
		{ label: '11:00 AM', value: '11:00' },
		{ label: '12:00 PM', value: '12:00' },
		{ label: '1:00 PM', value: '13:00' },
		{ label: '2:00 PM', value: '14:00' },
		{ label: '3:00 PM', value: '15:00' },
		{ label: '4:00 PM', value: '16:00' },
		{ label: '5:00 PM', value: '17:00' },
	];

	return (
		<div className='grid grid-cols-3 gap-3'>
			{times.map((time) => {
				const isSelected = selectedTime === time.value;

				return (
					<button
						key={time.value}
						type='button'
						onClick={() => onSelect(time.value)}
						className={`
							px-4 py-2 rounded-lg border text-sm font-medium
							transition-all duration-150 ease-in-out
							focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5E3C]
							${
								isSelected
									? 'bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-md scale-[1.02]'
									: 'bg-white text-gray-700 border-gray-300 hover:bg-[#EBD9C3] hover:border-[#C8A27C]'
							}
						`}
						aria-pressed={isSelected}>
						{time.label}
					</button>
				);
			})}
		</div>
	);
};
