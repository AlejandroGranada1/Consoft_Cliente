"use client"

import * as React from "react"

interface TimePickerProps {
  selectedTime: string | null
  onSelect: (time: string) => void
}

export const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  onSelect,
}) => {
  const times = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {times.map((time) => (
        <button
          key={time}
          type="button"
          onClick={() => onSelect(time)}
          className={`px-3 py-2 rounded-md border shadow-sm text-sm 
            ${
              selectedTime === time
                ? "bg-[#8B5E3C] text-white"
                : "bg-white text-gray-700 hover:bg-[#EBD9C3]"
            }`}
        >
          {time}
        </button>
      ))}
    </div>
  )
}
