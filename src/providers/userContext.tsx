// context/UserContext.tsx
'use client';

import { fetchCurrentUser } from '@/lib/utils';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
	id: string;
	email: string;
	role: {
		_id: string;
		name: string;
	};
}

interface UserContextType {
	user: User | null;
	loading: boolean;
	setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadUser() {
			const userData = await fetchCurrentUser();
			setUser(userData);
			setLoading(false);
		}

		loadUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, loading, setUser }}>{children}</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
	return context;
}
