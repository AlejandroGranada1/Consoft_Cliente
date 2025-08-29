"use client"

import React from "react"

interface AuthButtonProps {
  text: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: "button" | "submit" | "reset"
  className?: string
}

export default function AuthButton({
  text,
  onClick,
  type = "button", // 🔥 por defecto NO envía el form
  className,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full mt-4 bg-[#8B5E3C] text-white py-2 px-4 rounded-lg hover:bg-[#70492F] transition ${className ?? ""}`}
    >
      {text}
    </button>
  )
}