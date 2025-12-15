import '../globals.css';
import Navbar from '@/components/Global/Navbar';
import { CartProvider } from '@/providers/CartContext';
import ChatWrapper from '@/components/Chat/ChatWrapper';
import Footer from '@/components/Global/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {

	return (
		<CartProvider>
			<Navbar />
			<main className='flex-1'>{children}</main>
			<footer>
				<Footer/>
			</footer>
			{/* Chat flotante */}
			<ChatWrapper />
		</CartProvider>
	);
}
