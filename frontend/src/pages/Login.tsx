import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    console.log({ email, senha });
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Entrar
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Digite seu Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Senha</label>

            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua Senha:"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

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
