'use client';

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function AuthInput({
  label,
  type = 'text',
  placeholder,
  onChange,
  value,
  name,
  required,
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm
          px-4 py-3 text-sm text-white placeholder:text-white/30
          focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
          transition-all duration-200"
      />
    </div>
  );
}