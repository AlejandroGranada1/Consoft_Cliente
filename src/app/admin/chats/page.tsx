'use client';

import { ChevronDown, Send, MessageCircle, Package, User, Clock, CheckCheck } from 'lucide-react';
import { useGetAllCarts, useGetMessages, useGetOrders } from '@/hooks/apiHooks';
import { ChatMessage } from '@/lib/types';
import { useUser } from '@/providers/userContext';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Image from 'next/image';

export default function AdminChatsPage() {
	const [selectedChat, setSelectedChat] = useState<any>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [showProducts, setShowProducts] = useState(false);

	// Server-side paginated queries
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20; // Chats aren't natively paginated right now in UI but hooking up the API wrapper

	const { data, refetch: refetchCarts } = useGetAllCarts(currentPage, itemsPerPage);
	const { data: ordersData, refetch: refetchOrders } = useGetOrders(currentPage, itemsPerPage);

	const { data: messagesData } = useGetMessages(selectedChat?._id || selectedChat?.id || '');

	const [newMessage, setNewMessage] = useState('');
	const { user } = useUser();
	const socketRef = useRef<any>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// ----------------------------
	// Crear socket solo una vez
	// ----------------------------
	useEffect(() => {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
		socketRef.current = io(apiUrl, {
			withCredentials: true,
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, []);

	// ----------------------------
	// Obtener todas las cotizaciones
	// ----------------------------
	const allowedStatusesCarts = ['Solicitada', 'En Proceso', 'Cotizada'];
	const allowedStatusesOrders = ['Pendiente', 'En proceso', 'Completado', 'Aprobado']; // Ajusta según tus estados

	const quotationChats = (data?.quotations ?? []).filter((q: any) => allowedStatusesCarts.includes(q.status)).map((q: any) => ({ ...q, chatType: 'quotation' }));
	const orderChats = (ordersData?.orders ?? []).filter((o: any) => allowedStatusesOrders.includes(o.status || o.estado)).map((o: any) => ({ ...o, chatType: 'order', _id: o._id || o.id }));

	const chats = [...quotationChats, ...orderChats].sort((a, b) => {
		const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
		const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
		return dateB - dateA;
	});

	const refetch = () => {
		refetchCarts();
		refetchOrders();
	};

	// ----------------------------
	// Obtener mensajes del chat seleccionado
	// ----------------------------
	useEffect(() => {
		const normalized =
			messagesData?.messages.map((msg: any) => ({
				...msg,
				sender:
					typeof msg.sender === 'string'
						? { _id: msg.sender, name: '', email: '' }
						: msg.sender,
			})) || [];
		setMessages(normalized);
	}, [messagesData, selectedChat]);

	// ----------------------------
	// Unirse a la sala de la cotización seleccionada
	// ----------------------------
	useEffect(() => {
		if (!selectedChat || !socketRef.current) return;
		socketRef.current.emit('chat:join', { quotationId: selectedChat._id });
		socketRef.current.emit('quotation:join', { quotationId: selectedChat._id });
	}, [selectedChat]);

	// ----------------------------
	// Escuchar mensajes en tiempo real
	// ----------------------------
	useEffect(() => {
		if (!socketRef.current) return;
		const socket = socketRef.current;

		const handleMessage = (msg: any) => {
			const msgChatId = msg.quotation?._id || msg.quotation || msg.order?._id || msg.order;
			if (selectedChat && msgChatId === selectedChat._id) {
				setMessages((prev: any) => {
					if (prev.some((m: any) => m._id === msg._id)) return prev;

					// Remover mensaje temporal para evitar duplicados
					const filtered = prev.filter((m: any) => !(m._temp && m.message === msg.message));

					return [
						...filtered,
						{
							...msg,
							sender:
								typeof msg.sender === 'string'
									? { _id: msg.sender, name: '', email: '' }
									: msg.sender,
						},
					];
				});
				refetch();
			}
		};

		socket.on('chat:message', handleMessage);
		socket.on('quotation:message', handleMessage);

		return () => {
			socket.off('chat:message', handleMessage);
			socket.off('quotation:message', handleMessage);
		};
	}, [selectedChat]);

	// ----------------------------
	// Enviar mensaje
	// ----------------------------
	const sendMessage = () => {
		if (!newMessage.trim() || !selectedChat) return;

		const tempMessage = {
			_id: `temp-${Date.now()}`,
			quotation: selectedChat._id,
			sender: {
				_id: user?.id,
				name: user?.name || '',
				email: user?.email || '',
			},
			message: newMessage,
			createdAt: new Date().toISOString(),
			sentAt: new Date().toISOString(),
			_temp: true
		};

		setMessages((prev: any) => [...prev, tempMessage]);

		socketRef.current?.emit('chat:message', {
			quotationId: selectedChat._id,
			message: newMessage,
		});

		setNewMessage('');
	};

	// ----------------------------
	// Scroll automático
	// ----------------------------
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// ----------------------------
	// Formatear hora
	// ----------------------------
	const formatTime = (date: string) => {
		return new Date(date).toLocaleTimeString('es-CO', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};


	console.log(selectedChat)
	// ----------------------------
	// UI
	// ----------------------------
	return (
		<div
			className="flex h-screen w-full relative overflow-hidden"
			style={{
				background: `
					radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
					radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
					linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
				`,
			}}
		>
			{/* Grain effect */}
			<div
				className="fixed inset-0 pointer-events-none opacity-[0.045]"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					backgroundSize: '180px 180px',
				}}
			/>
			<div
				className="fixed inset-0 pointer-events-none"
				style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
			/>

			{/* SIDEBAR - Lista de chats */}
			<div className="w-1/3 border-r border-white/10 bg-white/5 backdrop-blur-sm flex flex-col">
				<div className="p-5 border-b border-white/10">
					<h2 className="font-serif text-white text-xl flex items-center gap-2">
						<MessageCircle size={20} className="text-[#C8A882]" />
						Chats de Clientes
					</h2>
					<p className="text-xs text-white/40 mt-1">
						{chats.length} conversaciones activas
					</p>
				</div>

				<div className="flex-1 overflow-y-auto p-3 space-y-2">
					{chats.length === 0 ? (
						<div className="text-center py-8 text-white/30 text-sm">
							No hay chats activos
						</div>
					) : (
						chats.map((chat: any) => {
							const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
							const isSelected = selectedChat?._id === chat._id;
							console.log(chat)
							return (
								<div
									key={chat._id}
									onClick={() => setSelectedChat(chat)}
									className={`p-4 rounded-xl cursor-pointer transition-all duration-200
										${isSelected
											? 'bg-[#C8A882]/20 border border-[#C8A882]/30'
											: 'bg-white/5 border border-white/10 hover:bg-white/8'
										}`}>
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8A882]/30 to-[#8B5E3C]/30 
											flex items-center justify-center text-[#C8A882] font-medium shrink-0">
											{chat.user?.name?.charAt(0).toUpperCase() || 'C'}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-center">
												<p className="text-sm font-medium text-white truncate">
													{chat.user?.name || `${chat.chatType === 'order' ? 'Pedido' : 'Cotización'}`}
													<br />	#{chat._id.slice(-6).toUpperCase()}
												</p>
												{lastMsg && (
													<span className="text-[10px] text-white/30">
														{formatTime(lastMsg.sentAt)}
													</span>
												)}
											</div>
											<div className="flex items-center gap-2 mt-2">
												<span className={`text-[10px] px-2 py-0.5 rounded-full border
													${chat.chatType === 'order'
														? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
														: 'bg-purple-500/10 text-purple-400 border-purple-500/20'}
												`}>
													{chat.chatType === 'order' ? 'Pedido' : 'Cotización'}
												</span>
												<span className="text-[10px] text-white/30">
													{chat.items?.length || 0} productos
												</span>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* PANEL DERECHO - Chat y productos */}
			<div className="w-2/3 flex flex-col bg-white/5 backdrop-blur-sm">
				{/* Header del chat */}
				<div className="p-5 border-b border-white/10 flex items-center justify-between relative">
					{selectedChat ? (
						<>
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C8A882] to-[#8B5E3C] 
									flex items-center justify-center text-white font-medium text-lg shadow-lg">
									{selectedChat.user?.name?.charAt(0).toUpperCase() || 'C'}
								</div>
								<div>
									<h3 className="text-white font-medium">
										{selectedChat.user?.name || 'Cliente'}
									</h3>
									<p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
										<Clock size={10} />
										Chat activo • {selectedChat.items?.length || 0} productos
									</p>
								</div>
							</div>

							{/* Botón dropdown de productos */}
							<div className="relative">
								<button
									onClick={() => setShowProducts(!showProducts)}
									className="flex items-center gap-2 px-4 py-2 rounded-lg
										bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20
										hover:bg-[#C8A882]/20 transition-all duration-200">
									<Package size={16} />
									<span className="text-sm">Productos</span>
									<ChevronDown size={14} className={`transition-transform ${showProducts ? 'rotate-180' : ''}`} />
								</button>

								{/* Dropdown de productos */}
								{showProducts && (
									<div className="absolute top-14 right-0 w-80 rounded-xl
										border border-white/10 bg-[#252320] shadow-2xl z-50
										backdrop-blur-xl">
										<div className="p-4 border-b border-white/10">
											<h4 className="text-sm font-medium text-white">Productos</h4>
											<p className="text-xs text-white/40 mt-0.5">
												{selectedChat.items?.length || 0} productos
											</p>
										</div>

										<div className="max-h-96 overflow-y-auto p-2 space-y-2">
											{selectedChat.items?.length > 0 ? (
												selectedChat.items.map((item: any) => (
													<div
														key={item._id}
														className="p-3 rounded-lg bg-white/5 border border-white/10
															hover:bg-white/8 transition-all duration-200">
														<div className="flex items-start gap-3">
															{item.product?.imageUrl || item.customDetails.referenceImage && (
																<div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
																	<Image
																		src={item.product?.imageUrl || item.customDetails.referenceImage}
																		alt={item.product?.name || item.customDetails.name}
																		width={48}
																		height={48}
																		className="object-cover w-full h-full"
																	/>
																</div>
															)}
															<div className="flex-1">
																<p className="text-sm font-medium text-white">
																	{item.product?.name || item.customDetails.name}
																</p>
																<div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-[10px]">
																	<span className="text-white/40">Cantidad:</span>
																	<span className="text-white/80">{item.quantity}</span>

																	{item.color && (
																		<>
																			<span className="text-white/40">Color:</span>
																			<span className="text-white/80">{item.color}</span>
																		</>
																	)}

																	{item.size && (
																		<>
																			<span className="text-white/40">Tamaño:</span>
																			<span className="text-white/80">{item.size}</span>
																		</>
																	)}

																	{item.product?.price && (
																		<>
																			<span className="text-white/40">Precio:</span>
																			<span className="text-[#C8A882] font-medium">
																				${item.product.price.toLocaleString()}
																			</span>
																		</>
																	)}
																</div>
															</div>
														</div>
													</div>
												))
											) : (
												<div className="text-center py-8 text-white/30 text-sm">
													No hay productos listados
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<div className="flex items-center gap-3">
							<MessageCircle size={24} className="text-white/40" />
							<div>
								<h3 className="text-white/70 font-medium">Selecciona un chat</h3>
								<p className="text-xs text-white/30 mt-0.5">
									Elige una conversación para comenzar
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Área de mensajes */}
				<div className="flex-1 overflow-y-auto p-6 space-y-4">
					{!selectedChat && (
						<div className="h-full flex flex-col items-center justify-center text-white/30">
							<MessageCircle size={48} strokeWidth={1} className="mb-3" />
							<p className="text-sm">Ningún chat seleccionado</p>
						</div>
					)}

					{selectedChat && messages.length === 0 && (
						<div className="h-full flex flex-col items-center justify-center text-white/30">
							<p className="text-sm">No hay mensajes aún</p>
							<p className="text-xs mt-1">Envía el primer mensaje para iniciar la conversación</p>
						</div>
					)}

					{selectedChat &&
						messages.map((msg, i) => {
							const isOwn = msg.sender._id === user?.id;
							const showDate = i === 0 ||
								new Date(msg.sentAt).toDateString() !== new Date(messages[i - 1]?.sentAt).toDateString();

							return (
								<div key={msg._id}>
									{showDate && (
										<div className="flex justify-center my-4">
											<span className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/40">
												{new Date(msg.sentAt).toLocaleDateString('es-CO', {
													weekday: 'long',
													day: 'numeric',
													month: 'long'
												})}
											</span>
										</div>
									)}
									<div className={`flex ${isOwn ? 'justify-end' : 'justify-start pl-4'}`}>
										<div className={`max-w-[70%] group relative`}>
											{!isOwn && (
												<div className="absolute -left-8 top-2 w-6 h-6 rounded-full 
													bg-gradient-to-br from-[#C8A882]/30 to-[#8B5E3C]/30 
													flex items-center justify-center text-[#C8A882] text-xs">
													{selectedChat.user?.name?.charAt(0).toUpperCase() || 'C'}
												</div>
											)}
											<div
												className={`p-4 rounded-2xl text-sm ${isOwn
													? 'bg-[#C8A882] text-[#1e1e1c] rounded-br-none'
													: 'bg-white/10 text-white rounded-bl-none border border-white/10'
													}`}>
												{msg.message}
											</div>
											<div className={`flex items-center gap-1 mt-1 text-[10px] text-white/30
												${isOwn ? 'justify-end' : 'justify-start pl-2'}`}>
												<span>{formatTime(msg.sentAt)}</span>
												{isOwn && <CheckCheck size={10} className="text-white/40" />}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					<div ref={messagesEndRef} />
				</div>

				{/* Input de mensaje */}
				{selectedChat && (
					<div className="p-5 border-t border-white/10 bg-white/5">
						<div className="flex gap-3">
							<input
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
								className="flex-1 px-5 py-3 rounded-xl
									bg-white/5 border border-white/15
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
								placeholder="Escribe un mensaje..."
							/>
							<button
								onClick={sendMessage}
								disabled={!newMessage.trim()}
								className="px-6 py-3 rounded-xl
									bg-[#8B5E3C] hover:bg-[#6F452A]
									text-white text-sm font-medium
									shadow-lg shadow-[#8B5E3C]/20
									disabled:opacity-50 disabled:cursor-not-allowed
									flex items-center gap-2
									transition-all duration-200">
								<Send size={16} />
								Enviar
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}