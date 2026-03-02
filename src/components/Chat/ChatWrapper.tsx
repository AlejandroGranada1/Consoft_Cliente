'use client';

import { useUser } from '@/providers/userContext';
import { useMyCart, useMyQuotations, useMyOrders } from '@/hooks/apiHooks';
import FloatingChat from './FloatingChat';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

const VALID_CHAT_STATES = ['Solicitada', 'En proceso', 'Cotizada'];

export default function ChatWrapper() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [chatId, setChatId] = useState<string | null>(null);
	const [chatType, setChatType] = useState<'quotation' | 'order'>('quotation');

	const { user, loading } = useUser();

	const { data: cartData, isLoading: cartLoading } = useMyCart();
	const { data: quotationsData, isLoading: quotationsLoading } = useMyQuotations();
	const { data: ordersData, isLoading: ordersLoading } = useMyOrders();

	useEffect(() => {
		if (loading || cartLoading || quotationsLoading || ordersLoading || !user) return;

		let activeChatId: string | null = null;
		let activeChatType: 'quotation' | 'order' = 'quotation';

		if (cartData && VALID_CHAT_STATES.includes(cartData.status)) {
			activeChatId = cartData._id;
		} else {
			const activeQuotation = quotationsData?.find(
				(q: any) => VALID_CHAT_STATES.includes(q.status)
			);
			if (activeQuotation) {
				activeChatId = activeQuotation._id;
			} else {
				const activeOrder = ordersData?.find(
					(o: any) => VALID_CHAT_STATES.includes(o.raw?.status)
				);
				if (activeOrder) {
					activeChatId = activeOrder.id;
					activeChatType = 'order';
				}
			}
		}

		setChatId(activeChatId);
		setChatType(activeChatType);

		if (!activeChatId) return;

		let socketInstance: Socket;

		import('socket.io-client').then((io) => {
			socketInstance = io.default(process.env.NEXT_PUBLIC_API_URL, {
				withCredentials: true,
			});
			setSocket(socketInstance);
		});

		return () => {
			socketInstance?.disconnect();
			setSocket(null);
		};

	}, [user, loading, cartLoading, quotationsLoading, ordersLoading, cartData, quotationsData, ordersData]);

	if (loading || !user) return null;

	return chatId ? (
		<FloatingChat
			chatId={chatId}
			chatType={chatType}
			socket={socket}
		/>
	) : null;
}