import type { Metadata } from 'next';
import '@/app/globals.css';
import { UserProvider } from '@/providers/userContext';
import QueryProvider from '@/providers/QueryProvider';
import Script from 'next/script';

export const metadata: Metadata = {
	title: 'ConSoft',
	description: 'Aplicación Web desarrollada para Confort & Estilo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='es'>
			<QueryProvider>
				<UserProvider>
					<head>
							<Script
								src='https://accounts.google.com/gsi/client'
								strategy='beforeInteractive'
							/>
					</head>
					<body>{children}</body>
				</UserProvider>
			</QueryProvider>
		</html>
	);
}
