'use client';

import { useUser } from '@/providers/userContext';
import { useMyCart } from '@/hooks/apiHooks';
import FloatingChat from './FloatingChat';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export default function ChatWrapper() {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		// Lazy load socket.io solo cuando se necesite
		import('socket.io-client').then((io) => {
			const socketInstance = io.default(process.env.NEXT_PUBLIC_API_URL);
			setSocket(socketInstance);
		});
	}, []);
	const { user, loading } = useUser();

	// 👇 Hook SIEMPRE debe ejecutarse
	const { data, isLoading } = useMyCart();

	// 👇 Después sí puedes retornar basándote en estados
	if (loading || !user || isLoading) return null;

	const quotationId = data?.quotations?.[0]?._id;

	return quotationId ? <FloatingChat quotationId={quotationId} /> : null;
}
