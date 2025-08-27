"use client"

import { Button } from "@/components/ui/button"

interface ServiceSelectorProps {
  value?: string
  onSelect: (service: string) => void
}

const defaultServices = ["Consulta", "Instalación", "Mantenimiento"]

export function ServiceSelector({ value, onSelect }: ServiceSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {defaultServices.map((service) => (
        <Button
          key={service}
          onClick={() => onSelect(service)}
          className={`px-4 py-2 rounded-xl shadow-md transition font-medium ${
            value === service
              ? "bg-[#8B5E3C] text-white"
              : "bg-[#F5F5F5] text-gray-800 hover:bg-[#E6D8C3]"
          }`}
        >
          {service}
        </Button>
      ))}
    </div>
  )
}