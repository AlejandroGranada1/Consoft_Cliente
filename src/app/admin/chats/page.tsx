'use client';

import { useGetAllCarts, useGetMessages } from '@/hooks/apiHooks';
import { ChatMessage } from '@/lib/types';
import { useUser } from '@/providers/userContext';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function AdminChatsPage() {
	const [selectedChat, setSelectedChat] = useState<any>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [newMessage, setNewMessage] = useState('');

	const { user } = useUser();

	// ----------------------------
	// Socket creado solo una vez
	// ----------------------------
	const socketRef = useRef<any>(null);

	useEffect(() => {
		socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
			withCredentials: true,
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, []);

	// ----------------------------
	// Obtener todas las cotizaciones
	// ----------------------------
	const { data, isLoading, refetch } = useGetAllCarts();

	const allowedStatuses = ['solicitada', 'en_proceso', 'cotizada'];
	const chats = (data?.quotations ?? []).filter((q) => allowedStatuses.includes(q.status));

	// ----------------------------
	// Obtener mensajes del chat seleccionado
	// ----------------------------
	const { data: messagesData } = useGetMessages(selectedChat?._id || '');

	useEffect(() => {
		setMessages(messagesData?.messages || []);
	}, [messagesData, selectedChat]);

	// ----------------------------
	// ESCUCHAR MENSAJES EN TIEMPO REAL
	// ----------------------------
	useEffect(() => {
		if (!socketRef.current) return;

		const socket = socketRef.current;

		socket.on('quotation_message', (msg: ChatMessage) => {
			// Si el mensaje pertenece al chat que está abierto
			if (selectedChat && msg.quotation === selectedChat._id) {
				setMessages((prev) => [...prev, msg]);
			}

			// Siempre actualizar lista de chats
			refetch();
		});

		return () => {
			socket.off('quotation_message');
		};
	}, [selectedChat]);

	// ----------------------------
	// ENVIAR MENSAJE VIA SOCKET
	// ----------------------------
	const sendMessage = () => {
		if (!newMessage.trim() || !selectedChat) return;

		socketRef.current?.emit('chat:message', {
			quotationId: selectedChat._id,
			message: newMessage,
			sender: user?.id,
		});

		// Pintar mensaje local instantáneo
		setMessages((prev) => [
			...prev,
			{
				quotation: selectedChat._id,
				message: newMessage,
				sender: user?.id as string,
				sentAt: new Date().toISOString(),
			},
		]);

		setNewMessage('');
	};

	// ----------------------------
	// UI PRINCIPAL
	// ----------------------------
	return (
		<div className='flex h-screen bg-[#FFFFFF]'>
			{/* SIDEBAR IZQUIERDA */}
			<div className='w-1/3 border-r border-gray-300 bg-[#F5F5F5]'>
				<div className='p-4 font-bold bg-[#6F4E37] text-white text-lg'>
					Chats de Cotizaciones
				</div>

				<div className='overflow-y-auto h-[calc(100%-3.5rem)]'>
					{chats.map((chat) => (
						<div
							key={chat._id}
							onClick={() => setSelectedChat(chat)}
							className={`p-4 border-b cursor-pointer hover:bg-[#eaeaea] ${
								selectedChat?._id === chat._id ? 'bg-[#6EC6FF33]' : 'bg-white'
							}`}>
							<div className='font-semibold text-[#000000]'>
								Cotización #{chat._id || chat._id.slice(-6)}
							</div>
							<div className='text-sm text-gray-600'>Estado: {chat.status}</div>
						</div>
					))}
				</div>
			</div>

			{/* PANEL DERECHO */}
			<div className='w-2/3 flex flex-col'>
				{/* Header */}
				<div className='p-4 bg-[#6EC6FF] text-black font-semibold shadow'>
					{selectedChat ? `Cotización #${selectedChat.number}` : 'Selecciona un chat'}
				</div>

				{/* Mensajes */}
				<div className='flex-1 overflow-y-auto p-4 bg-[#F0F0F0]'>
					{!selectedChat && (
						<div className='text-gray-600 text-center mt-10'>
							Selecciona un chat para ver los mensajes
						</div>
					)}

					{selectedChat &&
						messages.map((msg, i) => (
							<div
								key={i}
								className={`mb-3 max-w-[70%] p-3 rounded-xl text-sm ${
									msg.sender === user?.id
										? 'bg-[#6EC6FF] text-black ml-auto'
										: 'bg-white text-black'
								}`}>
								{msg.message}
							</div>
						))}
				</div>

				{/* Input */}
				{selectedChat && (
					<div className='p-4 bg-white border-t flex gap-3'>
						<input
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							className='flex-1 px-4 py-2 border rounded-full'
							placeholder='Escribe un mensaje...'
						/>

						<button
							onClick={sendMessage}
							className='px-6 py-2 bg-[#6F4E37] text-white rounded-full hover:bg-[#5a3e2d]'>
							Enviar
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
