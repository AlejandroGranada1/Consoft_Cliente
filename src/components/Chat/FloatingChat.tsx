'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useGetMessages } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

interface FloatingChatProps {
	quotationId?: string;
}

let socket: Socket | null = null;

export default function FloatingChat({ quotationId }: FloatingChatProps) {
	const { user } = useUser();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const [input, setInput] = useState('');
	const bottomRef = useRef<HTMLDivElement | null>(null);

	const { data } = useGetMessages(quotationId!);

	// Cargar mensajes iniciales al abrir chat
	useEffect(() => {
		if (!open || !data) return;

		setLoading(true);
		const normalized =
			data?.messages.map((msg: any) => ({
				...msg,
				sender:
					typeof msg.sender === 'string'
						? { _id: msg.sender, name: '', email: '' }
						: msg.sender,
			})) || [];
		setMessages(normalized);
		setLoading(false);
	}, [open, data]);

	// Auto-scroll
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// SOCKET.IO
	useEffect(() => {
		if (!quotationId || !open) return;

		if (!socket) {
			socket = io(process.env.NEXT_PUBLIC_API_URL!, {
				withCredentials: true,
			});
		}

		socket.emit('quotation:join', { quotationId });

		const handler = (newMsg: any) => {
			const msgNormalized = {
				...newMsg,
				sender:
					typeof newMsg.sender === 'string'
						? { _id: newMsg.sender, name: '', email: '' }
						: newMsg.sender,
			};
			setMessages((prev) => [...prev, msgNormalized]);
		};

		socket.on('chat:message', handler);

		return () => {
			socket?.off('chat:message', handler);
		};
	}, [open, quotationId]);

	const sendMessage = () => {
		if (!input.trim() || !quotationId) return;

		socket?.emit('chat:message', {
			quotationId,
			message: input,
		});

		setInput('');
	};

	return (
		<>
			<button
				onClick={() => setOpen((prev) => !prev)}
				className='fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all z-50'>
				{open ? <X size={24} /> : <MessageCircle size={24} />}
			</button>

			{open && (
				<div className='fixed bottom-20 right-6 w-80 h-96 bg-white shadow-xl rounded-xl border flex flex-col z-50'>
					<div className='px-4 py-3 border-b font-semibold text-gray-700'>
						Chat con el administrador
						<small className='text-xs block'>{quotationId}</small>
					</div>

					<div className='flex-1 overflow-y-auto px-4 py-2 space-y-3'>
						{loading ? (
							<p className='text-center text-gray-500'>Cargando...</p>
						) : messages.length === 0 ? (
							<p className='text-center text-gray-400 text-sm'>
								No hay mensajes aún.
							</p>
						) : (
							messages.map((msg: any) => {
								const isSentByMe = msg.sender._id === user?.id;
								return (
									<div
										key={msg._id}
										className={`p-2 rounded-lg max-w-[80%] ${
											isSentByMe
												? 'bg-blue-600 text-white ml-auto'
												: 'bg-gray-200 text-gray-800 mr-auto'
										}`}>
										<p className='text-sm'>{msg.message}</p>
										<span className='block text-[10px] opacity-70 mt-1'>
											{new Date(msg.sentAt).toLocaleString()}
										</span>
									</div>
								);
							})
						)}

						<div ref={bottomRef} />
					</div>

					<div className='p-3 border-t flex gap-2'>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='Escribe algo...'
							className='flex-1 px-3 py-2 border rounded-lg focus:outline-none text-sm'
						/>
						<button
							onClick={sendMessage}
							className='bg-blue-600 text-white px-3 rounded-lg text-sm'>
							Enviar
						</button>
					</div>
				</div>
			)}
		</>
	);
}
