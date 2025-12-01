import type { Metadata } from 'next';
import '@/app/globals.css';
import { UserProvider } from '@/providers/userContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import QueryProvider from '@/providers/QueryProvider';

export const metadata: Metadata = {
	title: 'ConSoft',
	description: 'Aplicación Web desarrollada para Confort & Estilo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='es'>
			<QueryProvider>
				<UserProvider>
					<body>{children}</body>
				</UserProvider>
			</QueryProvider>
		</html>
	);
}
