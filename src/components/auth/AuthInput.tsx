"use client";

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthInput({
  label,
  type = "text",
  placeholder,
  onChange,
  value,
  name,
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1E293B]">{label}</label>
      <input
        onChange={onChange}
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
      />
    </div>
  );
}
