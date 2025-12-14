// components/ui/Calendar.tsx
'use client';

import DatePicker from '@/components/ui/calendar';


interface CalendarProps {
  value?: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export function Calendar({
  value,
  onChange,
  className = '',
}: CalendarProps) {
  return (
    <div className={`p-2 rounded-lg border bg-white ${className}`}>
      <DatePicker
        value={value}
        onChange={onChange}
        className="w-full text-gray-800"
      />
    </div>
  );
}
