'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageCircle, X, Send, CheckCheck, Package } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { useGetMessages, useMyQuotations, useMyOrders } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

interface FloatingChatProps {
	chatId: string;
	chatType: 'quotation' | 'order';
	socket: Socket | null;
}

export default function FloatingChat({ chatId, chatType, socket }: FloatingChatProps) {
	const { user } = useUser();
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const [input, setInput] = useState('');
	const bottomRef = useRef<HTMLDivElement | null>(null);

	// Obtener datos según el tipo
	const { data: quotationsData } = useMyQuotations();
	const { data: ordersData } = useMyOrders();

	// Encontrar el chat actual en los datos
	const chatData = chatType === 'quotation'
		? quotationsData?.find((q: any) => q._id === chatId)
		: ordersData?.find((o: any) => o.id === chatId);

	// Obtener mensajes
	const { data: messagesData, refetch: refetchMessages } = useGetMessages(
		chatType === 'quotation' ? chatId : undefined
	);

	// Cargar mensajes iniciales
	useEffect(() => {
		if (!messagesData) return;

		const normalized = messagesData.messages?.map((msg: any) => ({
			...msg,
			sender: typeof msg.sender === 'string'
				? { _id: msg.sender, name: '', email: '' }
				: msg.sender,
		})) || [];
		
		setMessages(normalized);
	}, [messagesData]);

	// Auto-scroll
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Socket.IO - escuchar mensajes entrantes
	useEffect(() => {
		if (!socket || !chatId || !open) return;

		// Unirse a la sala del chat
		socket.emit('chat:join', { 
			quotationId: chatId,
		});

		const handleMessage = (newMsg: any) => {
			// Verificar si el mensaje pertenece a este chat
			if (newMsg.quotation !== chatId) return;
			
			// Verificar si el mensaje ya existe en el estado (evitar duplicados)
			setMessages((prev) => {
				if (prev.some(m => m._id === newMsg._id)) return prev;
				
				const msgNormalized = {
					...newMsg,
					sender: typeof newMsg.sender === 'string'
						? { _id: newMsg.sender, name: '', email: '' }
						: newMsg.sender,
				};
				return [...prev, msgNormalized];
			});
		};

		socket.on('chat:message', handleMessage);

		return () => {
			socket.off('chat:message', handleMessage);
			socket.emit('chat:leave', { quotationId: chatId });
		};
	}, [socket, chatId, open]);

	// Función para enviar mensaje (con optimización)
	const sendMessage = () => {
		if (!input.trim() || !socket || !chatId) return;

		// Crear mensaje temporal para UI optimista
		const tempMessage = {
			_id: `temp-${Date.now()}`,
			quotation: chatId,
			sender: {
				_id: user?.id,
				name: user?.name || '',
				email: user?.email || '',
			},
			message: input,
			createdAt: new Date().toISOString(),
			sentAt: new Date().toISOString(),
			// Flag para identificar mensajes temporales
			_temp: true
		};

		// Agregar mensaje al estado inmediatamente
		setMessages((prev) => [...prev, tempMessage]);

		// Emitir al servidor
		socket.emit('chat:message', {
			quotationId: chatId,
			message: input,
		});

		setInput('');
	};

	const formatTime = (date: string) => {
		return new Date(date).toLocaleTimeString('es-CO', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Carrito':
				return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
			case 'Solicitada':
				return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
			case 'En proceso':
				return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			case 'Cotizada':
				return 'bg-green-500/10 text-green-400 border-green-500/20';
			default:
				return 'bg-white/10 text-white/40 border-white/20';
		}
	};

	if (!chatData) return null;

	return (
		<>
			{/* Botón flotante */}
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="fixed bottom-6 right-6 z-50 p-4 rounded-full
					bg-[#8B5E3C] hover:bg-[#6F452A]
					text-white shadow-xl
					transition-all duration-200 hover:scale-110"
			>
				{open ? <X size={24} /> : <MessageCircle size={24} />}
			</button>

			{/* Ventana de chat */}
			{open && (
				<div
					className="fixed bottom-24 right-6 w-96 h-[500px] z-50
						rounded-2xl border border-white/10
						flex flex-col overflow-hidden
						shadow-2xl"
					style={{
						background: 'rgba(30,30,28,0.95)',
						backdropFilter: 'blur(20px)',
					}}
				>
					{/* Header */}
					<div className="px-5 py-4 border-b border-white/10">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8A882] to-[#8B5E3C] 
								flex items-center justify-center text-white font-medium">
								{chatData.user?.name?.charAt(0).toUpperCase() || 'C'}
							</div>
							<div className="flex-1">
								<h3 className="text-white font-medium text-sm">
									{chatType === 'quotation' ? 'Cotización' : 'Pedido'} #{chatId.slice(-6)}
								</h3>
								<div className="flex items-center gap-2 mt-1">
									<span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(
										chatType === 'quotation' ? chatData.status : chatData.estado
									)}`}>
										{chatType === 'quotation' ? chatData.status : chatData.estado}
									</span>
									{chatType === 'order' && (
										<span className="text-[10px] text-white/30 flex items-center gap-1">
											<Package size={10} />
											{chatData.raw?.items?.length || 0} items
										</span>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Mensajes */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4">
						{messages.length === 0 ? (
							<div className="h-full flex flex-col items-center justify-center text-white/30">
								<MessageCircle size={32} strokeWidth={1} className="mb-2" />
								<p className="text-sm">No hay mensajes aún</p>
								<p className="text-xs mt-1 text-center px-4">
									Envía un mensaje para iniciar la conversación con el administrador
								</p>
							</div>
						) : (
							messages.map((msg: any, idx: number) => {
								const isOwn = msg.sender._id === user?.id;
								const showDate = idx === 0 || 
									new Date(msg.createdAt).toDateString() !== 
									new Date(messages[idx-1]?.createdAt).toDateString();

								return (
									<div key={msg._id}>
										{showDate && (
											<div className="flex justify-center my-3">
												<span className="text-[8px] px-2 py-1 rounded-full bg-white/5 text-white/30">
													{new Date(msg.sentAt).toLocaleDateString('es-CO', {
														day: 'numeric',
														month: 'long'
													})}
												</span>
											</div>
										)}
										<div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
											<div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
												{!isOwn && (
													<div className="flex items-center gap-1 mb-1 ml-1">
														<span className="text-[10px] text-white/30">Administrador</span>
													</div>
												)}
												<div
													className={`p-3 rounded-2xl text-sm ${
														isOwn
															? 'bg-[#C8A882] text-[#1e1e1c] rounded-br-none'
															: 'bg-white/10 text-white rounded-bl-none border border-white/10'
													}`}>
													{msg.message}
												</div>
												<div className={`flex items-center gap-1 mt-1 text-[8px] text-white/30
													${isOwn ? 'justify-end mr-1' : 'justify-start ml-1'}`}>
													<span>{formatTime(msg.createdAt)}</span>
													{isOwn && <CheckCheck size={8} className={msg._temp ? 'opacity-50' : ''} />}
												</div>
											</div>
										</div>
									</div>
								);
							})
						)}
						<div ref={bottomRef} />
					</div>

					{/* Input */}
					<div className="p-4 border-t border-white/10 bg-white/5">
						<div className="flex gap-2">
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
								placeholder="Escribe un mensaje..."
								className="flex-1 px-4 py-2.5 rounded-xl
									bg-white/5 border border-white/15
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
							/>
							<button
								onClick={sendMessage}
								disabled={!input.trim()}
								className="px-4 py-2.5 rounded-xl
									bg-[#8B5E3C] hover:bg-[#6F452A]
									text-white text-sm font-medium
									disabled:opacity-50 disabled:cursor-not-allowed
									flex items-center gap-2
									transition-all duration-200"
							>
								<Send size={14} />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}