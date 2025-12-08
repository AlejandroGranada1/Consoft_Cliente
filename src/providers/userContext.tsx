'use client';
import { User as Usertype } from '@/lib/types';
import { fetchCurrentUser } from '@/lib/utils';
import { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
	user: Usertype | null;
	loading: boolean;
	setUser: (user: Usertype | null) => void;
	loadUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<Usertype | null>(null);
	const [loading, setLoading] = useState(true);

	// 🔥 CARGA AUTOMÁTICA AL MONTAR LA APP
	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = async () => {
		try {
			setLoading(true);
			const userData = await fetchCurrentUser();
			setUser(userData);
		} finally {
			setLoading(false);
		}
	};

	return (
		<UserContext.Provider value={{ user, loading, setUser, loadUser }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
	return context;
}
