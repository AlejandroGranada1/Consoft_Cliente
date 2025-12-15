'use client';

import { useState } from 'react';

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
	placeholder = '********',
	showRules = true,
}: Props) {
	const [show, setShow] = useState(false);

	const rules = {
		length: value.length >= 8,
		uppercase: /[A-Z]/.test(value),
		number: /\d/.test(value),
		special: /[^A-Za-z0-9]/.test(value),
	};

	const Rule = ({ ok, text }: { ok: boolean; text: string }) => (
		<li className={`text-sm ${ok ? 'text-green-600' : 'text-gray-400'}`}>
			{ok ? '✔' : '✖'} {text}
		</li>
	);

	return (
		<div>
			<label className="block mb-1 font-medium">{label}</label>

			<div className="relative">
				<input
					type={show ? 'text' : 'password'}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className="input pr-12"
				/>

				<button
					type="button"
					onClick={() => setShow(!show)}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
				>
					{show ? '🙈' : '👁️'}
				</button>
			</div>

			{showRules && (
				<ul className="mt-2 space-y-1">
					<Rule ok={rules.length} text="Mínimo 8 caracteres" />
					<Rule ok={rules.uppercase} text="Una letra mayúscula" />
					<Rule ok={rules.number} text="Un número" />
					<Rule ok={rules.special} text="Un carácter especial" />
				</ul>
			)}
		</div>
	);
}