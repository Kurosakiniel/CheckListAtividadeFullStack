import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import type { AtividadeFormData } from "../lib/types/types";

const schema = yup.object().shape({
  nome: yup.string().required("Nome da atividade obrigatório"),
  tipoDeAtividade: yup.string().required("Tipo de atividade obrigatório"),
  descricao: yup.string().required("Descrição obrigatória"),
  dificuldade: yup.string().required("Dificuldade obrigatória"),
});

function AtividadeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [carregando, setCarregando] = useState(!!id);
  const { register, handleSubmit, setValue, formState: { errors }, } = 
  useForm<AtividadeFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!id) return;

    async function carregarAtividade() {
      try {
        const token = localStorage.getItem("access");
        const res = await fetch(`http://localhost:8000/api/v1/atividades/${id}/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          navigate("/login");
          return; 
        }

        if (!res.ok) {
          alert("Atividade não encontrada");
          navigate("/atividades");
          return;
        }
        
        const dados = await res.json();


        setValue("nome", dados.nome);
        setValue("tipoDeAtividade", dados.tipoDeAtividade);
        setValue("descricao", dados.descricao);
        setValue("dificuldade", dados.dificuldade);

      } catch (error) {
        console.error("Erro ao carregar atividade:", error);
        alert("Erro ao carregar atividade. Tente novamente.");
        navigate("/atividades");
      } finally {
        setCarregando(false);
      }
    }

    carregarAtividade();
  }, [id]);

  // Reutilizei essa porra toda aqui

  const onSubmit = async (data: AtividadeFormData) => {
    try {
      const token = localStorage.getItem("access");
      const url = id

        ? `http://localhost:8000/api/v1/atividades/${id}/`
        : "http://localhost:8000/api/v1/atividades/";

      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         ...data,
          concluida: false, // nova atividade sempre começa como ativa justamente para ser concluída depois.
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Erro na resposta:", error);
        alert("Erro ao enviar dados. Verifique os campos e tente novamente.");
        return;
      }

      alert(`Atividade ${id ? "atualizada" : "cadastrada"} com sucesso!`);

      if (id) {
        navigate("/atividades/ativas"); 
        navigate("/atividades");
      }

    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao enviar dados. Tente novamente.");
    }
  };

  async function deletarAtividade() {
    const confirmacao = window.confirm("Tem certeza que deseja deletar esta atividade?");
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`http://localhost:8000/api/v1/atividades/${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Erro ao deletar atividade. Tente novamente.");
        return;
      }

      alert("Atividade deletada com sucesso!");
      navigate("/atividades");

    } catch (error) {
      console.error("Erro ao deletar atividade:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    }
  }

   if (carregando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-gray-600 text-lg">Carregando...</p>
      </main>
    );
  } 

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          {id ? "Editar Atividade" : "Nova Atividade"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome</label>
            <input
              {...register("nome")}
              placeholder="Digite o nome da atividade"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.nome && (
              <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo de Atividade</label>
            <input
              {...register("tipoDeAtividade")}
              placeholder="Digite o tipo de atividade"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.tipoDeAtividade && (
              <p className="text-red-500 text-xs mt-1">{errors.tipoDeAtividade.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Descrição
            </label>
            <textarea
              {...register("descricao")}
              rows={4}
              placeholder="Descreva a atividade"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            />
            {errors.descricao && (
              <p className="text-red-500 text-xs mt-1">
                {errors.descricao.message}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Dificuldade</p>

            <div className="flex gap-4">
              {["facil", "medio", "dificil"].map((nivel) => (
                <label
                  key={nivel}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    value={nivel}
                    {...register("dificuldade")}
                  />
                  {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                </label>
              ))}
            </div>

            {errors.dificuldade && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dificuldade.message}
              </p>
            )}
          </div>  

          <button
            type="submit"
            className="block w-11/12 mx-auto bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {id ? "Atualizar" : "Cadastrar"}
          </button>

          {id && (
            <button
              type="button"
              onClick={deletarAtividade}
              className="block w-11/12 mx-auto bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Deletar
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            type="button"
            className="block w-11/12 mx-auto border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Voltar
          </button>
        </form>
      </div>
    </main>
  );
}

export default AtividadeFormPage;