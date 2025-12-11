"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSendPayment } from "@/hooks/apiHooks"
import Swal from "sweetalert2"

export default function PagoPage() {
  const router = useRouter()
  const { id: pedidoId } = useParams()

  const [metodo, setMetodo] = useState<"nequi" | "bancolombia" | null>(null)
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [tipoPago, setTipoPago] = useState<"abono" | "final" | null>(null)

  const sendPayment = useSendPayment()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0]
      setFile(f)
      setComprobantePreview(URL.createObjectURL(f))
    }
  }

  const confirmarPago = () => {
    if (!file) {
      Swal.fire({ icon: "warning", title: "Falta comprobante" })
      return
    }
    if (!tipoPago) {
      Swal.fire({ icon: "warning", title: "Selecciona tipo de pago" })
      return
    }

    sendPayment.mutate(
      {
        orderId: pedidoId as string,
        file,
        tipoPago,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Pago enviado",
            text: "Tu comprobante está en verificación",
          }).then(() => router.push("/pedidos"))
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Error al enviar el pago",
            text: "Intenta nuevamente",
          })
        },
      }
    )
  }

  return (
    <main className="p-6 min-h-screen bg-[#FAF4EF] flex flex-col justify-between">
      <div>
        {/* Volver */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#6B4226] text-white rounded-full shadow hover:bg-[#4e2f1b]"
        >
          Volver
        </button>

        <h1 className="text-2xl font-bold text-center text-[#5C3A21] mb-8">
          Realizar Pago
        </h1>

        {/* Selección método */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <button
            onClick={() => setMetodo("nequi")}
            className={`p-4 rounded-xl border shadow text-center ${
              metodo === "nequi" ? "bg-[#FFD9E6] border-pink-400" : "bg-white"
            }`}
          >
            <p className="font-bold text-[#8B5E3C]">Nequi</p>
          </button>

          <button
            onClick={() => setMetodo("bancolombia")}
            className={`p-4 rounded-xl border shadow text-center ${
              metodo === "bancolombia"
                ? "bg-[#FFF1C4] border-yellow-400"
                : "bg-white"
            }`}
          >
            <p className="font-bold text-[#8B5E3C]">Bancolombia</p>
          </button>
        </div>

        {/* Comprobante */}
        <div className="mb-10">
          <p className="font-semibold text-[#8B5E3C] mb-2">Comprobante</p>

          {comprobantePreview ? (
            <img
              src={comprobantePreview}
              alt="Comprobante"
              className="w-full h-64 object-contain border rounded-lg shadow mb-4"
            />
          ) : (
            <div className="w-full h-64 border rounded-lg flex items-center justify-center text-gray-500 mb-4">
              Sin archivo seleccionado
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="w-full bg-white p-2 border rounded shadow"
          />
        </div>

        {/* Tipo de pago */}
        <div className="mb-6">
          <p className="font-semibold text-[#8B5E3C] mb-2">Tipo de pago</p>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => setTipoPago("abono")}
              className={`p-3 rounded-xl border shadow ${
                tipoPago === "abono"
                  ? "bg-[#F3E8D5] border-[#D1B08C]"
                  : "bg-white"
              }`}
            >
              Abono
            </button>

            <button
              onClick={() => setTipoPago("final")}
              className={`p-3 rounded-xl border shadow ${
                tipoPago === "final"
                  ? "bg-[#F3E8D5] border-[#D1B08C]"
                  : "bg-white"
              }`}
            >
              Pago Final
            </button>
          </div>
        </div>
      </div>

      {/* Botón Final */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={confirmarPago}
          className="px-6 py-3 bg-[#8B5E3C] text-white rounded-full shadow hover:bg-[#5C3A21] transition-colors"
          disabled={sendPayment.isPending}
        >
          {sendPayment.isPending ? "Enviando..." : "Confirmar Pago"}
        </button>
      </div>
    </main>
  )
}