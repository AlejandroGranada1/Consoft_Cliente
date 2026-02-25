'use client';

import { User } from '@/lib/types';
import { Eye, Edit, Trash2, MoreVertical, Mail, Phone, Shield } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface UserRowProps {
	user: User;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function UserRow({ user, onView, onEdit, onDelete }: UserRowProps) {
	const [showActions, setShowActions] = useState(false);

	const formatDate = (date: string | Date) => {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('es-CO', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className='relative group'>
			{/* Versión Desktop */}
			<div
				className='hidden md:grid grid-cols-[56px_1.2fr_2fr_1.2fr_1fr_0.8fr_1fr] gap-4 py-3 px-4
        rounded-xl border border-white/10 bg-white/5
        hover:bg-white/8 transition-all duration-200 items-center'>
				{/* Avatar */}
				<div className='flex justify-center'>
					{user.profile_picture ? (
						<div className='w-8 h-8 rounded-full overflow-hidden border border-white/10'>
							<Image
								src={user.profile_picture}
								alt={user.name}
								width={32}
								height={32}
								className='object-cover w-full h-full'
							/>
						</div>
					) : (
						<div
							className='w-8 h-8 rounded-full bg-gradient-to-br from-[#C8A882]/20 to-[#8B5E3C]/20
              flex items-center justify-center text-xs font-medium text-[#C8A882]'>
							{getInitials(user.name)}
						</div>
					)}
				</div>

				{/* Usuario */}
				<div className='text-left'>
					<p className='text-sm text-white/90 font-medium'>{user.name}</p>
					{user.phone && (
						<p className='text-xs text-white/40 flex items-center gap-1 mt-0.5'>
							<Phone size={10} /> {user.phone}
						</p>
					)}
				</div>

				{/* Correo */}
				<div className='text-left'>
					<p className='text-sm text-white/70 flex items-center gap-2'>
						<Mail
							size={12}
							className='text-white/40'
						/>
						{user.email}
					</p>
				</div>

				{/* Rol */}
				<div className='text-left'>
					<span
						className='text-xs px-2 py-1 rounded-full
            bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20'>
						{(user.role as any)?.name || 'Sin rol'}
					</span>
				</div>

				{/* Fecha */}
				<div className='text-left'>
					<p className='text-sm text-white/60'>{formatDate(user.registeredAt)}</p>
				</div>

				{/* Estado */}
				<div className='text-left'>
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium
            ${
				user.status
					? 'bg-green-500/10 text-green-400 border border-green-500/20'
					: 'bg-red-500/10 text-red-400 border border-red-500/20'
			}`}>
						{user.status ? 'Activo' : 'Inactivo'}
					</span>
				</div>

				{/* Acciones */}
				<div className='flex items-center justify-center gap-2'>
					<button
						onClick={onView}
						className='p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
              hover:bg-white/5 transition-all duration-200'
						title='Ver detalles'>
						<Eye size={16} />
					</button>
					<button
						onClick={onEdit}
						className='p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
              hover:bg-white/5 transition-all duration-200'
						title='Editar'>
						<Edit size={16} />
					</button>
					<button
						onClick={onDelete}
						className='p-1.5 rounded-lg text-white/40 hover:text-red-400
              hover:bg-white/5 transition-all duration-200'
						title='Eliminar'>
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			{/* Versión Mobile */}
			<div className='md:hidden rounded-xl border border-white/10 bg-white/5 p-4'>
				<div className='flex items-start gap-3'>
					{/* Avatar */}
					{user.profile_picture ? (
						<div className='w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0'>
							<Image
								src={user.profile_picture}
								alt={user.name}
								width={40}
								height={40}
								className='object-cover w-full h-full'
							/>
						</div>
					) : (
						<div
							className='w-10 h-10 rounded-full bg-gradient-to-br from-[#C8A882]/20 to-[#8B5E3C]/20
              flex items-center justify-center text-sm font-medium text-[#C8A882] flex-shrink-0'>
							{getInitials(user.name)}
						</div>
					)}

					<div className='flex-1 min-w-0'>
						<h3 className='text-white font-medium text-sm truncate'>{user.name}</h3>
						<p className='text-xs text-white/40 truncate mt-0.5'>{user.email}</p>

						<div className='flex items-center gap-2 mt-2'>
							<span
								className={`text-[10px] px-2 py-0.5 rounded-full
                ${
					user.status
						? 'bg-green-500/10 text-green-400 border border-green-500/20'
						: 'bg-red-500/10 text-red-400 border border-red-500/20'
				}`}>
								{user.status ? 'Activo' : 'Inactivo'}
							</span>
							<span
								className='text-[10px] px-2 py-0.5 rounded-full
                bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20'>
								{(user.role as any)?.name || 'Sin rol'}
							</span>
						</div>
					</div>

					{/* Menú de acciones mobile */}
					<div className='relative'>
						<button
							onClick={() => setShowActions(!showActions)}
							className='p-2 rounded-lg text-white/40 hover:text-white
                hover:bg-white/5 transition-all'>
							<MoreVertical size={18} />
						</button>

						{showActions && (
							<div
								className='absolute right-0 mt-2 w-32 rounded-lg
                border border-white/10 bg-[#252320] shadow-lg z-10'>
								<button
									onClick={() => {
										onView();
										setShowActions(false);
									}}
									className='w-full px-4 py-2 text-left text-sm text-white/70
                    hover:bg-white/5 first:rounded-t-lg
                    flex items-center gap-2'>
									<Eye size={14} /> Ver
								</button>
								<button
									onClick={() => {
										onEdit();
										setShowActions(false);
									}}
									className='w-full px-4 py-2 text-left text-sm text-white/70
                    hover:bg-white/5
                    flex items-center gap-2'>
									<Edit size={14} /> Editar
								</button>
								<button
									onClick={() => {
										onDelete();
										setShowActions(false);
									}}
									className='w-full px-4 py-2 text-left text-sm text-red-400
                    hover:bg-white/5 last:rounded-b-lg
                    flex items-center gap-2'>
									<Trash2 size={14} /> Eliminar
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
