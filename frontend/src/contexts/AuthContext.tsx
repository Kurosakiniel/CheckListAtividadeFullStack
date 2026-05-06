import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("access");
  });

  function login(access: string, refresh: string) {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setToken(access);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}