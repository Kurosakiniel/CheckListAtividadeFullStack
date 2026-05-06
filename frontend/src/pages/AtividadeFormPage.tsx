import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import type { AtividadeFormData } from "../lib/types/types";
import api from "../lib/types/api";

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

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<AtividadeFormData>({ resolver: yupResolver(schema) });

  // ─── CARREGAR DADOS PARA EDIÇÃO ───────────────────────────
  useEffect(() => {
    if (!id) return;

    async function carregarAtividade() {
      try {
        // axios já envia o token pelo interceptor — não precisa passar header
        const res = await api.get(`/atividades/${id}/`);
        const dados = res.data; // ← axios já converte para JSON

        setValue("nome", dados.nome);
        setValue("tipoDeAtividade", dados.tipoDeAtividade);
        setValue("descricao", dados.descricao);
        setValue("dificuldade", dados.dificuldade);

      } catch (error) {
        alert("Erro ao carregar atividade.");
        navigate("/atividades/ativas");
      } finally {
        setCarregando(false);
      }
    }

    carregarAtividade();
  }, [id]);

  // ─── SALVAR (CRIAR OU EDITAR) ─────────────────────────────
  const onSubmit = async (data: AtividadeFormData) => {
    try {
      // axios usa "data:" no lugar de "body: JSON.stringify()"
      if (id) {
        await api.put(`/atividades/${id}/`, { ...data, concluida: false });
      } else {
        await api.post("/atividades/", { ...data, concluida: false });
      }

      alert(id ? "Atividade atualizada!" : "Atividade cadastrada!");

      // ← redireciona para lugar certo dependendo da ação
      if (id) {
        navigate("/atividades/ativas");
      } else {
        navigate("/atividades");
      }

    } catch (error) {
      alert("Erro ao salvar atividade. Verifique os campos e tente novamente.");
    }
  };

  // ─── DELETAR ──────────────────────────────────────────────
  async function deletarAtividade() {
    const confirmado = window.confirm("Tem certeza que deseja excluir esta atividade?");
    if (!confirmado) return;

    try {
      await api.delete(`/atividades/${id}/`);
      alert("Atividade excluída!");
      navigate("/atividades/ativas");

    } catch (error) {
      alert("Erro ao excluir atividade.");
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">Carregando...</p>
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
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo de Atividade</label>
            <input
              {...register("tipoDeAtividade")}
              placeholder="Digite o tipo de atividade"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.tipoDeAtividade && <p className="text-red-500 text-xs mt-1">{errors.tipoDeAtividade.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Descrição</label>
            <textarea
              {...register("descricao")}
              rows={4}
              placeholder="Descreva a atividade"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            />
            {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Dificuldade</p>
            <div className="flex gap-4">
              {["facil", "medio", "dificil"].map((nivel) => (
                <label key={nivel} className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="radio" value={nivel} {...register("dificuldade")} />
                  {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                </label>
              ))}
            </div>
            {errors.dificuldade && <p className="text-red-500 text-xs mt-1">{errors.dificuldade.message}</p>}
          </div>

          <button
            type="submit"
            className="block w-11/12 mx-auto bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {id ? "Atualizar" : "Cadastrar"}
          </button>

          {/* Botão de deletar só aparece no modo edição */}
          {id && (
            <button
              type="button"
              onClick={deletarAtividade}
              className="block w-11/12 mx-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Excluir atividade
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(-1)}
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