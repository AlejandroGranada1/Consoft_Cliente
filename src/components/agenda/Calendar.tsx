"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

interface CalendarProps {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | { from: Date; to?: Date }
  onSelect?: (date: any) => void
  className?: string
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className = "",
}: CalendarProps) {
  return (
    <div className={`p-2 rounded-lg border bg-white ${className}`}>
      <DayPicker
        mode={mode}                     // ✅ corregido
        selected={selected}
        onSelect={onSelect}
        className="w-[320px] inline-block text-gray-800" // ✅ texto visible
        styles={{
          caption: { color: "#1f2937", fontWeight: "600" }, // mes visible
          head: { color: "#374151" },                       // días de semana visibles
          day: { color: "#111827" },                        // días del mes visibles
        }}
      />
    </div>
  )
}