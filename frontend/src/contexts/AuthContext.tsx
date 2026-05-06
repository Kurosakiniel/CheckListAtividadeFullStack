import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Define o formato do contexto
type AuthContextType = {
  token: string | null;
  logado: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
};

// Cria o contexto com valor inicial vazio
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// AuthProvider envolve toda a aplicação e disponibiliza os dados de auth
export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicia já lendo o token do localStorage (para persistir após recarregar)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access")
  );

  // true se tiver token, false se não tiver
  const logado = !!token;

  function login(access: string, refresh: string) {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setToken(access); // atualiza o estado global
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null); // limpa o estado global
  }

  return (
    // Disponibiliza token, logado, login e logout para toda a aplicação
    <AuthContext.Provider value={{ token, logado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto facilmente em qualquer componente
// Em vez de "useContext(AuthContext)", usamos só "useAuth()"
export function useAuth() {
  return useContext(AuthContext);
}