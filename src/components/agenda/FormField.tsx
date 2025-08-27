"use client"

import * as React from "react"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function FormField({ label, className, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`w-full p-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-sm ${className}`}
        {...props}
      />
    </div>
  )
}