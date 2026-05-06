import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import type { LoginData } from "../lib/types/types";

const schema = yup.object({
  username: yup.string().required("Usuário obrigatório"),
  password: yup.string().required("Senha obrigatória"),
});

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  async function handleLogin(data: LoginData) {
    try {
      const res = await fetch("http://localhost:8000/api/v1/token/", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        alert("Usuário ou senha inválidos");
        console.error(json);
        return;
      }

      // salva os tokens
      localStorage.setItem("access", json.access);
      localStorage.setItem("refresh", json.refresh);

      alert("Login realizado");

      navigate("/atividades");
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Entrar
        </h1>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          {/* USERNAME */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              {...register("username")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* SENHA */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Senha</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                {...register("password")}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            className="block w-11/12 mx-auto bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4 cursor-pointer hover:underline">
          Esqueceu a senha?
        </p>
      </div>
    </main>
  );
}