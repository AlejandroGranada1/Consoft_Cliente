'use client';

import { useState } from 'react';
import {
  format, isSameDay, addMonths, subMonths,
  startOfMonth, endOfMonth, eachDayOfInterval,
  isBefore, startOfToday, isToday, getDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  className?: string;
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function DatePicker({ value, onChange, className = '' }: DatePickerProps) {
  const today        = startOfToday();
  const [selected, setSelected]     = useState(value || today);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selected));

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;
    setSelected(date);
    onChange(date);
  };

  const daysInMonth  = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startPadding = getDay(startOfMonth(currentMonth)); // blanks before first day

  return (
    <div className={`select-none ${className}`}>

      {/* ── Navegación mes ── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-sm font-semibold text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </span>

        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Cabecera días ── */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-[#C8A882] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* ── Días del mes ── */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Padding inicial */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {daysInMonth.map((day) => {
          const isPast     = isBefore(day, today);
          const isSelected = isSameDay(day, selected);
          const isTodayDay = isToday(day);

          return (
            <button
              type="button"
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              disabled={isPast}
              title={isPast ? 'Fecha no disponible' : undefined}
              className={`
                relative mx-auto w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-150
                ${isPast
                  // Pasado — texto muy tenue, sin hover, cursor bloqueado
                  ? 'text-white/20 cursor-not-allowed opacity-30 pointer-events-none'
                  : isSelected
                  // Seleccionado
                  ? 'bg-[#8B5E3C] text-white shadow-md shadow-black/20 scale-105'
                  : isTodayDay
                  // Hoy (no seleccionado)
                  ? 'border border-[#C8A882] text-[#C8A882] font-semibold hover:bg-[#8B5E3C]/30'
                  // Futuro disponible
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
                }
              `}
            >
              {format(day, 'd')}
              {/* Punto indicador de hoy */}
              {isTodayDay && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C8A882]" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Leyenda ── */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10 px-1">
        <span className="flex items-center gap-1.5 text-[11px] text-white/30">
          <span className="w-3 h-3 rounded-full bg-white/15 opacity-30 inline-block" />
          Fecha pasada
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#C8A882]">
          <span className="w-3 h-3 rounded-full border border-[#C8A882] inline-block" />
          Hoy
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-white/60">
          <span className="w-3 h-3 rounded-full bg-[#8B5E3C] inline-block" />
          Seleccionado
        </span>
      </div>
    </div>
  );
}