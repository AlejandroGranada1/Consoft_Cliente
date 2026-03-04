'use client';

import React from 'react';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: number;
    onChange: (value: number) => void;
    className?: string;
    prefix?: string;
}

export const CurrencyInput = ({
    value,
    onChange,
    className = '',
    prefix = '$',
    ...props
}: CurrencyInputProps) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove all non-digits
        const rawValue = e.target.value.replace(/\D/g, '');
        const numericValue = rawValue === '' ? 0 : Number(rawValue);
        onChange(numericValue);
    };

    const formattedValue = value === 0 && props.placeholder ? '' : value.toLocaleString('es-CO');

    return (
        <div className="relative w-full group/currency">
            {prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A882] text-xs font-bold pointer-events-none">
                    {prefix}
                </span>
            )}
            <input
                {...props}
                type="text"
                value={formattedValue}
                onChange={handleInputChange}
                className={`w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 ${prefix ? 'pl-7' : 'px-4'} pr-3 text-sm font-bold text-[#C8A882] 
          placeholder:text-white/10 focus:border-[#C8A882]/50 focus:bg-white/[0.06] focus:outline-none 
          transition-all duration-300 tabular-nums text-right shadow-inner group-hover/currency:border-white/20
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
            />
        </div>
    );
};
