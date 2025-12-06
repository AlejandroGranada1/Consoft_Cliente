'use client';

import '../globals.css';
import Navbar from '@/components/Global/Navbar';
import { CartProvider } from '@/providers/CartContext';
import FloatingChat from '@/components/Chat/FloatingChat';
import { useMyCart } from '@/hooks/apiHooks';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const { data } = useMyCart();
	const quotationId = data?.quotations[0]?._id;
	return (
		<CartProvider>
			<Navbar />
			<main className='flex-1'>{children}</main>

			{/* Chat flotante */}
			{quotationId && <FloatingChat quotationId={quotationId} />}
		</CartProvider>
	);
}
