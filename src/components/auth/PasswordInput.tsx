'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  showRules?: boolean;
};

export default function PasswordInput({
  label,
  value,
  onChange,
  name,
  placeholder = '••••••••',
  showRules = true,
}: Props) {
  const [show, setShow] = useState(false);

  const rules = {
    length:    value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    number:    /\d/.test(value),
    special:   /[^A-Za-z0-9]/.test(value),
  };

  const ruleList = [
    { ok: rules.length,    text: 'Mínimo 8 caracteres' },
    { ok: rules.uppercase, text: 'Una letra mayúscula' },
    { ok: rules.number,    text: 'Un número' },
    { ok: rules.special,   text: 'Un carácter especial' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm
            px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30
            focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
            transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      {showRules && value.length > 0 && (
        <ul className="grid grid-cols-2 gap-1.5 mt-1">
          {ruleList.map(({ ok, text }) => (
            <li key={text} className={`flex items-center gap-1.5 text-[11px] transition-colors ${ok ? 'text-emerald-400' : 'text-white/30'}`}>
              {ok
                ? <Check size={11} className="shrink-0" />
                : <X size={11} className="shrink-0" />
              }
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}