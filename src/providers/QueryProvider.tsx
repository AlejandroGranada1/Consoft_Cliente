'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// Configuración optimizada de React Query
function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minuto
				gcTime: 5 * 60 * 1000, // 5 minutos (antes era cacheTime)
				refetchOnWindowFocus: false, // Evita refetches innecesarios
				retry: 1, // Reduce reintentos
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (typeof window === 'undefined') {
		// Server: siempre crear un nuevo query client
		return makeQueryClient();
	} else {
		// Browser: reutilizar el mismo cliente
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
}

export default function QueryProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(getQueryClient);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}