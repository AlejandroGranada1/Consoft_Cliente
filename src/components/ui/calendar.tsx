// components/ui/DatePicker.tsx
'use client';

import { useState } from 'react';
import { format, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export default function DatePicker({ value, onChange, className = '' }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  const handleDateClick = (date: Date) => {
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
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth} className="text-xl text-gray-600">←</button>
        <span className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={handleNextMonth} className="text-xl text-gray-600">→</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-sm font-semibold text-gray-500">{day}</div>
        ))}
        
        {daysInMonth.map((day) => (
          <button
            key={day.toString()}
            onClick={() => handleDateClick(day)}
            className={`py-2 px-3 rounded-full w-full text-sm ${
              isSameDay(day, selectedDate)
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200 text-gray-800'
            }`}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>

      <input
        type="date"
        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
        onChange={(e) => handleDateClick(new Date(e.target.value))}
        className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
