'use client';

import * as React from 'react';

interface TimePickerProps {
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

const TIMES = [
  { label: '8:00 AM',  value: '08:00' },
  { label: '9:00 AM',  value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '11:00 AM', value: '11:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '1:00 PM',  value: '13:00' },
  { label: '2:00 PM',  value: '14:00' },
  { label: '3:00 PM',  value: '15:00' },
  { label: '4:00 PM',  value: '16:00' },
  { label: '5:00 PM',  value: '17:00' },
];

export const TimePicker: React.FC<TimePickerProps> = ({ selectedTime, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TIMES.map((time) => {
        const isSelected = selectedTime === time.value;
        return (
          <button
            key={time.value}
            type="button"
            onClick={() => onSelect(time.value)}
            aria-pressed={isSelected}
            className={`
              px-3 py-2.5 rounded-xl border text-sm font-medium
              transition-all duration-150 focus:outline-none
              ${isSelected
                ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white shadow-md shadow-black/20'
                : 'bg-white/10 border-white/20 text-white/75 hover:bg-white/20 hover:border-white/40 hover:text-white'
              }
            `}
          >
            {time.label}
          </button>
        );
      })}
    </div>
  );
};