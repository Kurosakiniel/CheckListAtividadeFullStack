import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import type { AtividadeFormData } from "../lib/types/types";
import { api } from "../lib/api"; // Importando sua instância do Axios

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
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors },
    reset 
  } = useForm<AtividadeFormData>({
    resolver: yupResolver(schema),
  });

  // --- BUSCAR DADOS (EDIÇÃO) ---
  useEffect(() => {
    if (!id) {
      reset(); // Limpa o form se for uma nova atividade
      return;
    }

    async function carregarAtividade() {
      try {
        // O Axios já usa a baseURL e o interceptor anexa o Token automaticamente
        const res = await api.get(`/atividades/${id}/`);
        const dados = res.data;

        // Preenche os campos do formulário
        setValue("nome", dados.nome);
        setValue("tipoDeAtividade", dados.tipoDeAtividade);
        setValue("descricao", dados.descricao);
        setValue("dificuldade", dados.dificuldade);

      } catch (error: any) {
        console.error("Erro ao carregar atividade:", error);
        
        if (error.response?.status === 404) {
          alert("Atividade não encontrada!");
        } else {
          alert("Erro ao conectar com o servidor.");
        }
        navigate("/atividades");
      } finally {
        setCarregando(false);
      }
    }

    carregarAtividade();
  }, [id, setValue, navigate, reset]);

  // --- CRIAR OU EDITAR ---
  const onSubmit = async (data: AtividadeFormData) => {
    try {
      const payload = { ...data, concluida: false };

      if (id) {
        // Fluxo de Edição (PUT)
        await api.put(`/atividades/${id}/`, payload);
        alert("Atividade atualizada com sucesso!");
      } else {
        // Fluxo de Criação (POST)
        await api.post("/atividades/", payload);
        alert("Atividade cadastrada com sucesso!");
      }

      navigate("/atividades"); // Redireciona para a listagem
    } catch (error: any) {
      console.error("Erro ao enviar dados:", error);
      alert(error.response?.data?.detail || "Erro ao salvar atividade. Verifique os campos.");
    }
  };

  // --- DELETAR ---
  async function deletarAtividade() {
    const confirmacao = window.confirm("Tem certeza que deseja deletar esta atividade?");
    if (!confirmacao) return;

    try {
      await api.delete(`/atividades/${id}/`);
      alert("Atividade deletada com sucesso!");
      navigate("/atividades");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar atividade.");
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-gray-600 text-lg animate-pulse">Carregando dados...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          {id ? "Editar Atividade" : "Nova Atividade"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Nome */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome</label>
            <input
              {...register("nome")}
              placeholder="Digite o nome da atividade"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          {/* Campo Tipo */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo de Atividade</label>
            <input
              {...register("tipoDeAtividade")}
              placeholder="Ex: Estudo, Trabalho, Exercício"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
            />
            {errors.tipoDeAtividade && <p className="text-red-500 text-xs mt-1">{errors.tipoDeAtividade.message}</p>}
          </div>

          {/* Campo Descrição */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Descrição</label>
            <textarea
              {...register("descricao")}
              rows={3}
              placeholder="Descreva a atividade..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none resize-none"
            />
            {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
          </div>

          {/* Campo Dificuldade */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Dificuldade</p>
            <div className="flex gap-4">
              {["facil", "medio", "dificil"].map((nivel) => (
                <label key={nivel} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" value={nivel} {...register("dificuldade")} className="accent-gray-700" />
                  {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                </label>
              ))}
            </div>
            {errors.dificuldade && <p className="text-red-500 text-xs mt-1">{errors.dificuldade.message}</p>}
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              {id ? "Salvar Alterações" : "Cadastrar Atividade"}
            </button>

            {id && (
              <button
                type="button"
                onClick={deletarAtividade}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Deletar Atividade
              </button>
            )}

            <button
              onClick={() => navigate(-1)}
              type="button"
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AtividadeFormPage;