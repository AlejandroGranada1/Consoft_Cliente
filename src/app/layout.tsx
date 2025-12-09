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
	console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!)
	return (
		<html lang='es'>
			<QueryProvider>
				<UserProvider>
					<body>{children}

						<Script
							src="https://accounts.google.com/gsi/client"
							strategy="afterInteractive"
						/>
					</body>
				</UserProvider>
			</QueryProvider>
		</html>
	);
}
