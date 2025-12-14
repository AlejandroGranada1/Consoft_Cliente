'use client';

import { UserProvider } from '@/providers/userContext';
import QueryProvider from '@/providers/QueryProvider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<UserProvider>{children}</UserProvider>
		</QueryProvider>
	);
}
