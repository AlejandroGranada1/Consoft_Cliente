"use client"

import { ReactNode } from "react"

interface AuthLayoutProps {
  title: string
  subtitle?: string
  illustration: string
  children: ReactNode
}

export default function AuthLayout({ title, subtitle, illustration, children }: AuthLayoutProps) {
  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Ilustración */}
      <div className="bg-[#8B5E3C] flex flex-col items-center justify-center p-10 text-white">
        <img src={illustration} alt="Auth Illustration" className="max-w-xs mb-6" />
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        {subtitle && <p className="mt-2 text-center text-sm">{subtitle}</p>}
      </div>

      {/* Formulario */}
      <div className="bg-[#FAF3F0] flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
          {children}
        </div>
      </div>
    </section>
  )
}