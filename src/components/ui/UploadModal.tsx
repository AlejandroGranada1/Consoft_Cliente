"use client"

import { Dialog } from "@headlessui/react"

interface UploadModalProps {
  open: boolean
  onClose: () => void
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Contenido */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
          <Dialog.Title className="text-xl font-bold text-[#8B5E3C] mb-4">
            Adjuntar comprobante
          </Dialog.Title>

          <div className="border-2 border-dashed border-[#8B5E3C] rounded-lg p-6">
            <p className="mb-2 text-gray-700">Cargar imagen</p>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-[#8B5E3C] file:text-white hover:file:bg-[#5C3A21]"
            />
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-[#8B5E3C] text-white rounded-lg shadow hover:bg-[#5C3A21]"
          >
            Cerrar
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
