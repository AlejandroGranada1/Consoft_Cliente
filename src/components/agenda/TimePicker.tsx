'use client';

import * as React from 'react';

interface TimePickerProps {
  selectedTime: string | null;
  onSelect: (time: string) => void;
  availableSlots?: string[];
  isLoading?: boolean;
}

const TIME_LABELS: Record<string, string> = {
  '08:00': '8:00 AM',
  '09:00': '9:00 AM',
  '10:00': '10:00 AM',
  '11:00': '11:00 AM',
  '12:00': '12:00 PM',
  '13:00': '1:00 PM',
  '14:00': '2:00 PM',
  '15:00': '3:00 PM',
  '16:00': '4:00 PM',
  '17:00': '5:00 PM',
  '18:00': '6:00 PM',
  '19:00': '7:00 PM',
  '20:00': '8:00 PM',
};

export const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  onSelect,
  availableSlots = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[#8B5E3C]'></div>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className='rounded-xl border border-white/10 bg-white/5 p-6 text-center'>
        <p className='text-white/40 text-sm'>
          Selecciona una fecha para ver los horarios disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-2'>
      {availableSlots.map((value) => {
        const isSelected = selectedTime === value;
        const label = TIME_LABELS[value] || value;

        return (
          <button
            key={value}
            type='button'
            onClick={() => onSelect(value)}
            aria-pressed={isSelected}
            className={`
              px-3 py-2.5 rounded-xl border text-sm font-medium
              transition-all duration-150 focus:outline-none
              ${isSelected
                ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white shadow-md shadow-black/20'
                : 'bg-white/10 border-white/20 text-white/75 hover:bg-white/20 hover:border-white/40 hover:text-white'
              }
            `}>
            {label}
          </button>
        );
      })}
    </div>
  );
};