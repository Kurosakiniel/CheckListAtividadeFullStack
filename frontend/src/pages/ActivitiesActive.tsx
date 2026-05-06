import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Atividade } from "../lib/types/types";

export function ActivitiesActive() {
  const navigate = useNavigate();
  // Lista de atividades que virão da API
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

    async function concluirAtividade(id: number) {
        try {
            const token = localStorage.getItem("access");
            const res = await fetch(`http://localhost:8000/api/v1/atividades/${id}/`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ concluida: true }), // atualiza o campo concluida para true
            });

            if (!res.ok) {
                alert("Erro ao concluir atividade. Tente novamente.");
                return;
            }

            // Atualiza a lista local removendo a atividade concluída e redirecionando para a tela de atividades concluídas
            setAtividades(prev => prev.filter(atividade => atividade.id !== id));
            navigate("/atividades/ativas");

        } catch (error) {
            alert("Erro ao conectar com o servidor.");
        }
    }

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
            const ativas = dados.results.filter(
                (atividade: Atividade) => atividade.concluida === false);
            setAtividades(ativas);

            

        } catch (error) {
            setErro("Não foi possível conectar ao servidor.");
        } finally {
            setCarregando(false);
        }
}


    buscarAtividades(); 

  }, []);


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
          <button
            onClick={() => navigate("/atividades")}
            className="text-gray-600 underline"
          >
            Voltar para o início
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header da página */}
      <header className="h-14 sm:h-16 bg-gray-300 flex items-center gap-3 px-4 shadow">
        
        {/* Botão de voltar para a Home */}
        <button onClick={() => navigate("/atividades")} className="p-1">
          <ArrowLeft size={28} className="text-black" />
        </button>

        <h1 className="text-lg font-semibold text-gray-800">
          Atividades Ativas
        </h1>
      </header>

      {/* Área do conteúdo */}
      <section className="p-4 sm:p-6">

        {atividades.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <p className="text-xl">Nenhuma atividade ativa no momento.</p>
          </div>

        ) : (

          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">

            {/* .map() percorre o array e transforma cada item em um card */}
            {atividades.map((atividade) => (

              // O React usa "key" para identificar cada item
              <div
                key={atividade.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {atividade.nome}
                  </h2>
                    {/* Dificuldade com cores */}
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

                {/* Tipo da atividade */}
                <p className="text-sm text-gray-500">{atividade.tipoDeAtividade}</p>

                {/* Descrição */}
                <p className="text-sm text-gray-700">{atividade.descricao}</p>

                {/* Botão para editar a atividade — navega passando o id na URL */}
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => navigate(`/atividades/${atividade.id}`)}
                        className="
                            flex-1
                            text-sm text-gray-600
                            bg-gray-300
                            border border-gray-300
                            py-2 rounded-lg
                            hover:bg-gray-100
                            transition
                        "
                    >
                        Editar
                    </button>

                    <button
                        onClick={() => concluirAtividade(atividade.id)}
                        className="
                            flex-1
                            text-sm text-white
                            bg-green-600
                            py-2 rounded-lg
                            hover:bg-green-700
                            transition
                        "
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