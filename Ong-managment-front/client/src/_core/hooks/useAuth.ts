import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

const TOKEN_KEY = "ong-gestor-pro-token";

export function useAuth() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        // Tenta decodificar o token
        const payload = JSON.parse(atob(token.split(".")[1]));
        
        // Adicione uma verificação básica de expiração se o seu JWT tiver o campo 'exp'
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          throw new Error("Token expirado");
        }

        setUser({
          id: payload.user_id,
          name: payload.name || "Usuário",
          email: payload.email || "",
        });
      } catch {
        // Se qualquer coisa falhar, removemos o token inválido
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser({
      id: payload.user_id,
      name: payload.name || "Usuário",
      email: payload.email || "",
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setLocation("/login");
  }, [setLocation]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };
}