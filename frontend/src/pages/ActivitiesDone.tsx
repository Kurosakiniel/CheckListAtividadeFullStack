import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Atividade } from "../lib/types/types";
import { api } from "../lib/api"; // Importando sua instância do axios

export function ActivitiesDone() {
  const navigate = useNavigate();

  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarAtividades() {
      try {
        setCarregando(true);
        // 🔥 Usando o filtro que criamos no Django: concluida=true
        const res = await api.get("/atividades/?concluida=true");

        // Lógica para lidar com ou sem paginação (blindado)
        const dados = Array.isArray(res.data) 
          ? res.data 
          : (res.data.results || []);

        setAtividades(dados);
      } catch (error: any) {
        console.error("Erro ao buscar atividades:", error);
        
        // O Axios interceptor que você provavelmente tem já lida com o 401,
        // mas aqui tratamos o erro de exibição
        setErro("Não foi possível carregar as atividades concluídas.");
      } finally {
        setCarregando(false);
      }
    }

    buscarAtividades();
  }, []);

  // ─── REABRIR ATIVIDADE ────────────────────────────────────
  async function reabrirAtividade(id: number) {
    try {
      // Faz o PATCH mudando concluida para false
      await api.patch(`/atividades/${id}/`, {
        concluida: false,
      });

      // Remove da lista de concluídas instantaneamente na tela
      setAtividades((anterior) => anterior.filter((a) => a.id !== id));
      
    } catch (error) {
      alert("Erro ao reabrir atividade.");
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Carregando histórico...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="h-16 bg-white border-b flex items-center gap-3 px-4 sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate("/home")} 
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          Atividades Concluídas
        </h1>
      </header>

      <section className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
        {erro ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-center">
            {erro}
          </div>
        ) : atividades.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <p className="text-xl font-medium">Nenhuma atividade concluída.</p>
            <p className="text-sm">Finalize algo para ver seu histórico aqui!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {atividades.map((atividade) => (
              <div
                key={atividade.id}
                className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-3 opacity-80 hover:opacity-100 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-400 line-through decoration-gray-400">
                      {atividade.nome}
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {atividade.tipoDeAtividade}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase bg-gray-100 text-gray-500">
                    Concluída
                  </span>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {atividade.descricao}
                </p>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => reabrirAtividade(atividade.id)}
                    className="flex-1 text-sm font-semibold text-gray-700 bg-gray-100 py-2.5 rounded-xl hover:bg-gray-200 transition"
                  >
                    Reabrir Atividade
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}