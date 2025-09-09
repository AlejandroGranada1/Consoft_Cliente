"use client"

import { useState } from "react"
import { Calendar, TimePicker, FormField, ServiceSelector } from "@/components/agenda"

export default function ScheduleSection() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [service, setService] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ service, date, time, description })
  }

  return (
    <section className="py-10 px-4 bg-[#fff9f6]">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-1 text-gray-900">
        Agenda tu visita
      </h2>
      <p className="text-center text-gray-700 mb-6">
        Elige la fecha, hora y servicio que más te convenga
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-5 md:p-8 grid grid-cols-1 gap-6 max-w-4xl mx-auto"
      >
        {/* Selector de servicio */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            Selecciona el servicio
          </h3>
          <ServiceSelector value={service} onSelect={setService} />
        </div>

        {/* Calendario y horas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Selecciona la fecha
            </h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="mx-auto"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Selecciona la hora
              </h3>
              <TimePicker selectedTime={time} onSelect={setTime} />
            </div>

            <img
              src="/Agenda.png"
              alt="Ilustración agenda"
              className="max-w-[140px] mt-6 opacity-95"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            Añade una descripción
          </h3>
          <FormField
            label=""
            placeholder="Añade una descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Botón */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#8B5E3C] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-[#734a2e] transition"
          >
            Agendar
          </button>
        </div>
      </form>
    </section>
  )
}
