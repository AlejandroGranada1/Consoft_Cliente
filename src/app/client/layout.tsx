import '../globals.css';
import Navbar from '@/components/Global/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Navbar />
			<main className='flex-1'>{children}</main>
		</div>
	);
}
