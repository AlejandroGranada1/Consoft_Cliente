'use client';

import React from 'react';

interface AuthButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export default function AuthButton({
  text,
  onClick,
  type = 'button',
  className,
  disabled,
  loading,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full mt-2 bg-[#8B5E3C] hover:bg-[#6F452A]
        disabled:opacity-50 disabled:cursor-not-allowed
        text-white py-3.5 px-6 rounded-xl
        text-sm font-medium
        shadow-lg shadow-[#8B5E3C]/20 hover:shadow-[#8B5E3C]/30
        transition-all duration-200
        ${className ?? ''}`}
    >
      {loading ? 'Cargando...' : text}
    </button>
  );
}