'use client';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import { Role, User } from '@/lib/types';
import Image from 'next/image';

interface UserRowProps {
	user: User;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function UserRow({ user, onView, onEdit, onDelete }: UserRowProps) {
	return (
		<>
			{/* ===== MOBILE (card) ===== */}
			<div className="md:hidden flex flex-col gap-3 border-b border-gray-200 py-4">
				<div className="flex items-center gap-3">
					<Image
						src={user.profile_picture || '/default_user.png'}
						alt="Usuario"
						width={40}
						height={40}
						className="rounded-full object-cover border"
					/>

					<div className="min-w-0">
						<p className="font-semibold truncate">{user.name}</p>
						<p className="text-sm text-gray-600 truncate">
							{user.email}
						</p>
					</div>
				</div>

				<div className="flex justify-between text-sm">
					<span>{(user.role as Role)?.name}</span>
					<span
						className={`font-medium ${
							user.status ? 'text-green-600' : 'text-red-500'
						}`}
					>
						{user.status ? 'Activo' : 'Inactivo'}
					</span>
				</div>

				<div className="flex gap-4 pt-2">
					<Eye
						size={18}
						className="cursor-pointer text-yellow-500"
						onClick={onView}
					/>
					<Pencil
						size={18}
						className="cursor-pointer text-blue-500"
						onClick={onEdit}
					/>
					<Trash2
						size={18}
						className="cursor-pointer text-red-500"
						onClick={onDelete}
					/>
				</div>
			</div>

			{/* ===== DESKTOP (tabla real) ===== */}
			<div
				className="
					hidden md:grid
					grid-cols-[56px_1.2fr_2fr_1.2fr_1fr_0.8fr_1fr]
					items-center gap-4
					border-b border-gray-200 py-4
				"
			>
				{/* Foto */}
				<div className="flex justify-center">
					<Image
						src={user.profile_picture || '/default_user.png'}
						alt="Usuario"
						width={48}
						height={48}
						className="rounded-full object-cover border"
					/>
				</div>

				{/* Nombre */}
				<p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
					{user.name}
				</p>

				{/* Correo */}
				<p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
					{user.email}
				</p>

				{/* Rol */}
				<p>{(user.role as Role)?.name}</p>

				{/* Fecha */}
				<p>{new Date(user.registeredAt).toLocaleDateString()}</p>

				{/* Estado */}
				<span
					className={`font-medium ${
						user.status ? 'text-green-600' : 'text-red-500'
					}`}
				>
					{user.status ? 'Activo' : 'Inactivo'}
				</span>

				{/* Acciones */}
				<div className="flex gap-4 justify-center">
					<Eye
						size={18}
						className="cursor-pointer text-yellow-500 hover:scale-110 transition"
						onClick={onView}
					/>
					<Pencil
						size={18}
						className="cursor-pointer text-blue-500 hover:scale-110 transition"
						onClick={onEdit}
					/>
					<Trash2
						size={18}
						className="cursor-pointer text-red-500 hover:scale-110 transition"
						onClick={onDelete}
					/>
				</div>
			</div>
		</>
	);
}
