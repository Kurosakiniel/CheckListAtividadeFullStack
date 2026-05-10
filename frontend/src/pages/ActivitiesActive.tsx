import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import type { Atividade } from "../lib/types/types";
import { api } from "../lib/api";

export function ActivitiesActive() {
  const navigate = useNavigate();

  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarAtividades() {
      try {
        // 1. Faz a chamada (o ?concluida=false continua sendo importante)
        const res = await api.get("/atividades/?concluida=false");
        
        // 2. A MUDANÇA ESTÁ AQUI:
        // Como você tirou a paginação, os dados estão direto no 'res.data'
        // Mas usamos essa lógica abaixo para ser "à prova de balas":
        const dados = Array.isArray(res.data) 
          ? res.data 
          : (res.data.results || []);
        
        setAtividades(dados);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
        setErro("Erro ao carregar dados.");
      } finally {
        setCarregando(false);
      }
    }
    buscarAtividades();
  }, []);
   
  async function concluirAtividade(id: number) {
    try {
      await api.patch(`/atividades/${id}/`, {
        concluida: true,
      });

      // Remove da tela instantaneamente
      setAtividades((anterior) => anterior.filter((a) => a.id !== id));
    } catch (error) {
      alert("Erro ao concluir atividade.");
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Buscando atividades...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header Fixo */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Atividades Ativas</h1>
        </div>
        
        <button
          onClick={() => navigate("/atividades/new")}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2 px-4"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nova</span>
        </button>
      </header>

      <section className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
        {erro ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-center">
            {erro}
          </div>
        ) : atividades.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <p className="text-xl font-medium">Nenhuma atividade ativa!</p>
            <p className="text-sm">As 38 atividades do banco podem estar concluídas.</p>
            <button
              onClick={() => navigate("/atividades/new")}
              className="mt-4 text-blue-600 font-semibold hover:underline"
            >
              Criar nova atividade agora
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {atividades.map((atividade) => (
              <div
                key={atividade.id}
                className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-3 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{atividade.nome}</h2>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {atividade.tipoDeAtividade}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                    atividade.dificuldade === "facil" ? "bg-green-100 text-green-700" :
                    atividade.dificuldade === "medio" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {atividade.dificuldade}
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {atividade.descricao}
                </p>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => navigate(`/atividades/${atividade.id}`)}
                    className="flex-1 text-sm font-semibold text-gray-700 bg-gray-100 py-2.5 rounded-xl hover:bg-gray-200 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => concluirAtividade(atividade.id)}
                    className="flex-1 text-sm font-semibold text-white bg-green-600 py-2.5 rounded-xl hover:bg-green-700 transition"
                  >
                    Concluir
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