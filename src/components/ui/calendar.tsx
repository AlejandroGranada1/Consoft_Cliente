"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "rounded-lg bg-white border border-gray-200 text-gray-900 text-sm w-fit",
        className
      )}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-2",
        caption: "flex justify-center items-center relative",
        caption_label: "text-base font-semibold text-gray-800",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-6 w-6 bg-transparent text-gray-600 hover:bg-gray-100 rounded-md flex items-center justify-center",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "border-collapse w-[280px]", // 🔥 fijamos ancho
        head_row: "flex justify-between",
        head_cell: "w-8 text-gray-500 font-medium text-xs",
        row: "flex justify-between mt-1",
        cell: "h-8 w-8 text-center relative p-0",
        day: "h-8 w-8 flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-[#EBD9C3] transition",
        day_selected:
          "bg-[#8B5E3C] text-white rounded-md hover:bg-[#6f4a2f]",
        day_today:
          "border border-[#8B5E3C] text-[#8B5E3C] font-bold",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-300 opacity-50",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}