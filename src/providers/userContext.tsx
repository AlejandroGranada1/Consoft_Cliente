"use client";

import { User as Usertype } from "@/lib/types";
import { fetchCurrentUser } from "@/lib/utils";
import { createContext, useContext, useState, useEffect } from "react";

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

  const PUBLIC_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  // 🚀 CONTROLAR CARGA AUTOMÁTICA DEL USUARIO
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;

      // ❌ Si la ruta es pública, NO intentamos cargar el usuario
      if (PUBLIC_ROUTES.some((route) => path.startsWith(route))) {
        setLoading(false);
        return;
      }
    }

    // ✔ Si no es pública, verificamos el usuario
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (_err) {
      setUser(null);
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
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
}
