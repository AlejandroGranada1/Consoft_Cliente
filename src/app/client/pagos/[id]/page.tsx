"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"

export default function PagoPage() {
  const [comprobante, setComprobante] = useState<string | null>(null)
  const [tipoPago, setTipoPago] = useState<"abono" | "final" | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setComprobante(url)
    }
  }

  const confirmarPago = () => {
    if (!tipoPago) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona el tipo de pago",
        text: "Debes indicar si es un abono parcial o un pago final.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#6B4226",
        background: "#FAF4EF",
        color: "#5C3A21",
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "¡Pago enviado!",
      text: `Tu comprobante fue cargado como ${tipoPago === "abono" ? "Abono parcial" : "Pago final"}. El pago está en verificación.`,
      confirmButtonText: "Ok",
      confirmButtonColor: "#6B4226",
      background: "#FAF4EF",
      color: "#5C3A21",
    }).then(() => {
      window.location.href = "/pedidos"
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FAF4EF] p-6">
      <div className="w-full max-w-6xl">
        {/* Botón volver */}
        <Link
          href="/pedidos"
          className="inline-flex items-center px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition"
        >
          Atrás
        </Link>

        <h1 className="text-center text-2xl font-semibold text-[#5C3A21] my-6">
          Continua con el pago
        </h1>

        <div className="grid grid-cols-3 gap-6 items-start">
          {/* Columna QR */}
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <Image src="/pagos/qrbanco.png" alt="Bancolombia" width={180} height={180} />
              <p className="mt-2 text-sm text-[#5C3A21]">Pagos a Bancolombia</p>
              <label className="mt-3 cursor-pointer inline-flex items-center px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition">
                Adjuntar comprobante
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>

            <div className="flex flex-col items-center">
              <Image src="/pagos/qrnequi.png" alt="Nequi" width={180} height={180} />
              <p className="mt-2 text-sm text-[#5C3A21]">Pagos a Nequi</p>
              <label className="mt-3 cursor-pointer inline-flex items-center px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition">
                Adjuntar comprobante
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>
          </div>

          {/* Columna comprobante */}
          <div className="flex flex-col items-center gap-4">
            {!comprobante ? (
              <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-[#6B4226]/40 rounded-2xl bg-white shadow">
                <label className="cursor-pointer flex flex-col items-center gap-2 text-[#6B4226]">
                  <span className="px-4 py-2 rounded-full bg-[#6B4226] text-white text-sm hover:bg-[#4e2f1b] transition">
                    Cargar imagen
                  </span>
                  <span className="text-xs text-gray-500">o arrastra aquí tu comprobante</span>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>
            ) : (
              <>
                <Image
                  src={comprobante}
                  alt="Comprobante"
                  width={220}
                  height={220}
                  className="rounded-lg shadow"
                />

                {/* Radios para tipo de pago */}
                <div className="flex flex-col gap-2 text-[#5C3A21] text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tipoPago"
                      value="abono"
                      checked={tipoPago === "abono"}
                      onChange={() => setTipoPago("abono")}
                    />
                    Abono parcial
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tipoPago"
                      value="final"
                      checked={tipoPago === "final"}
                      onChange={() => setTipoPago("final")}
                    />
                    Pago final
                  </label>
                </div>

                <Button
                  onClick={confirmarPago}
                  className="bg-[#6B4226] hover:bg-[#4e2f1b] rounded-full px-6 mt-2"
                >
                  Siguiente
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
