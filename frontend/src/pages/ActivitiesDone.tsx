import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Atividade } from "../lib/types/types";

export function ActivitiesDone() {
  const navigate = useNavigate();

  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarAtividades() {
      try {
        const token = localStorage.getItem("access");

        const res = await fetch("http://localhost:8000/api/v1/atividades/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          navigate("/");
          return;
        }

        if (!res.ok) {
          setErro("Erro ao buscar atividades. Tente novamente.");
          return;
        }

        const dados = await res.json();

        // Única diferença do filtro: concluida === true
        const concluidas = dados.results.filter(
          (atividade: Atividade) => atividade.concluida === true
        );
        setAtividades(concluidas);

      } catch (error) {
        setErro("Não foi possível conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    }

    buscarAtividades();
  }, []);


  // ─── REABRIR ATIVIDADE ────────────────────────────────────
  // Faz o caminho inverso do "Concluir" — muda concluida para false, logo ela volta para a tela de atividades ativas.
  async function reabrirAtividade(id: number) {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(`http://localhost:8000/api/v1/atividades/${id}/`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ concluida: false }),
      });

      if (!res.ok) {
        alert("Erro ao reabrir atividade.");
        return;
      }

      setAtividades((anterior) => anterior.filter((a) => a.id !== id));

    } catch (error) {
      alert("Não foi possível conectar ao servidor.");
    }
  }


  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">Carregando...</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{erro}</p>
          <button onClick={() => navigate("/home")} className="text-gray-600 underline">
            Voltar para o início
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="h-14 sm:h-16 bg-gray-300 flex items-center gap-3 px-4 shadow">
        <button onClick={() => navigate("/atividades")} className="p-1">
          <ArrowLeft size={28} className="text-black" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          Atividades Concluídas
        </h1>
      </header>

      <section className="p-4 sm:p-6">
        {atividades.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400 max-w-2xl mx-auto w-full">
            <p className="text-xl">Nenhuma atividade concluída ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            {atividades.map((atividade) => (
              <div
                key={atividade.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {atividade.nome}
                  </h2>

                  <span className={`
                    text-xs font-medium px-2 py-1 rounded-full
                    ${atividade.dificuldade === "facil"
                      ? "bg-green-100 text-green-700"
                      : atividade.dificuldade === "medio"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }
                  `}>
                    {atividade.dificuldade.charAt(0).toUpperCase() + atividade.dificuldade.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-500">{atividade.tipoDeAtividade}</p>
                <p className="text-sm text-gray-700">{atividade.descricao}</p>

                {/* Botão de reabrir */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => reabrirAtividade(atividade.id)}
                    className="
                      flex-1
                      text-sm text-white
                      bg-gray-500
                      py-2 rounded-lg
                      hover:bg-gray-600
                      transition
                    "
                  >
                    Reabrir
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