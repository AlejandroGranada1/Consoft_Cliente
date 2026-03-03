'use client';

import { User as Usertype } from '@/lib/types';
import { fetchCurrentUser } from '@/lib/utils';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface UserContextType {
	user: Usertype | null;
	loading: boolean;
	setUser: (user: Usertype | null) => void;
	loadUser: () => Promise<Usertype | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
	'/auth/login',
	'/auth/register',
	'/auth/forgot-password',
	'/auth/reset-password',
];

// Función helper fuera del componente
const isPublicRoute = (path: string) => {
	return PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<Usertype | null>(null);
	const [loading, setLoading] = useState(true);
	const hasLoadedRef = useRef(false); // 👈 Evita cargas múltiples

	const loadUser = useCallback(async (): Promise<Usertype | null> => {
		try {
			setLoading(true);
			const userData = await fetchCurrentUser();
			setUser(userData);
			return userData;
		} catch (_err) {
			setUser(null);
			return null;
		} finally {
			setLoading(false);
		}
	}, []); // 👈 Sin dependencias - la función nunca cambia

	useEffect(() => {
		// Solo ejecutar una vez
		if (hasLoadedRef.current) return;
		hasLoadedRef.current = true;

		// Verificar si estamos en una ruta pública
		const path = window.location.pathname;

		if (isPublicRoute(path)) {
			setLoading(false);
			return;
		}

		// Solo cargar usuario en rutas privadas
		loadUser();
	}, []); // 👈 Array vacío - solo se ejecuta al montar

	// Solo en desarrollo - REMOVIDO para evitar re-renders
	// if (process.env.NODE_ENV === 'development') {
	// 	console.log('Current user:', user);
	// }

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
