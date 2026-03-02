'use client';

import DatePicker from '@/components/ui/calendar';

interface CalendarProps {
  value?: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export function Calendar({ value, onChange, className = '' }: CalendarProps) {
  return (
    <div className={`p-2 rounded-xl ${className}`}>
      <DatePicker
        value={value}
        onChange={onChange}
        className="w-full [&_*]:text-white [&_.rdp-day_button:hover]:bg-white/10 [&_.rdp-day_button]:text-white/80 [&_.rdp-day_button.rdp-day_selected]:bg-[#8B5E3C] [&_.rdp-nav_button]:text-white/70 [&_.rdp-head_cell]:text-[#C8A882] [&_.rdp-caption_label]:text-white"
      />
    </div>
  );
}