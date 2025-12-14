import type { Metadata } from 'next';
import '@/app/globals.css';
import { Providers } from '@/providers/Providers';

export const metadata: Metadata = {
	title: 'ConSoft',
	description: 'Aplicación Web desarrollada para Confort & Estilo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='es'>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}