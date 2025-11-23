"use client";

import '../globals.css';
import Navbar from '@/components/Global/Navbar';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<CartProvider>
			<Navbar />
			<main className='flex-1'>{children}</main>
		</CartProvider>
	);
}
