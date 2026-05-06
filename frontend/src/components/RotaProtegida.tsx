import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

// Envolve qualquer rota que precisa de autenticação
// Se não estiver logado, redireciona para o login automaticamente
export function RotaProtegida({ children }: { children: ReactNode }) {
  const { logado } = useAuth();

  if (!logado) {
    return <Navigate to="/" replace />;
    // "replace" substitui o histórico — o usuário não consegue voltar com o botão
  }

  return <>{children}</>;
}