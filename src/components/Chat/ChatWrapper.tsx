'use client';

import { useUser } from '@/providers/userContext';
import { useMyCart, useMyQuotations, useMyOrders } from '@/hooks/apiHooks';
import FloatingChat from './FloatingChat';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

// Estados válidos para mostrar el chat (todos excepto Cerrada/Completada)
const VALID_CHAT_STATES = ['Solicitada', 'En proceso', 'Cotizada'];

export default function ChatWrapper() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [chatId, setChatId] = useState<string | null>(null);
	const [chatType, setChatType] = useState<'quotation' | 'order'>('quotation');

	useEffect(() => {
		import('socket.io-client').then((io) => {
			const socketInstance = io.default(process.env.NEXT_PUBLIC_API_URL, {
				withCredentials: true,
			});
			setSocket(socketInstance);
		});
	}, []);

	const { user, loading } = useUser();

	// Obtener cotizaciones del usuario
	const { data: cartData, isLoading: cartLoading } = useMyCart();
	const { data: quotationsData, isLoading: quotationsLoading } = useMyQuotations();
	
	// Obtener pedidos del usuario
	const { data: ordersData, isLoading: ordersLoading } = useMyOrders();

	useEffect(() => {
		if (loading || cartLoading || quotationsLoading || ordersLoading || !user) return;

		// 1. Buscar cotización activa primero (desde el carrito actual)
		if (cartData && VALID_CHAT_STATES.includes(cartData.status)) {
			setChatId(cartData._id);
			setChatType('quotation');
			return;
		}

		// 2. Buscar en cotizaciones del usuario
		const activeQuotation = quotationsData?.find(
			(q: any) => VALID_CHAT_STATES.includes(q.status)
		);

		if (activeQuotation) {
			setChatId(activeQuotation._id);
			setChatType('quotation');
			return;
		}

		// 3. Buscar en pedidos del usuario
		const activeOrder = ordersData?.find(
			(o: any) => VALID_CHAT_STATES.includes(o.raw?.status)
		);

		if (activeOrder) {
			setChatId(activeOrder.id);
			setChatType('order');
			return;
		}

		// 4. No hay nada activo
		setChatId(null);
	}, [
		user, loading,
		cartLoading, quotationsLoading, ordersLoading,
		cartData, quotationsData, ordersData
	]);

	if (loading || !user) return null;

	return chatId ? (
		<FloatingChat 
			chatId={chatId} 
			chatType={chatType}
			socket={socket}
		/>
	) : null;
}