import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import type { AtividadeFormData } from "../lib/types/types";

const schema = yup.object().shape({
  nome: yup.string().required("Nome da atividade obrigatório"),
  tipo: yup.string().required("Tipo obrigatório"),
  descricao: yup.string().required("Descrição obrigatória"),
  dificuldade: yup.string().required("Dificuldade obrigatória"),
});

function AtividadeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AtividadeFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: AtividadeFormData) => {
    console.log("Dados:", data);
    alert("Funcionou 😄");
  };

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
            <label className="block text-sm text-gray-600 mb-1">Tipo</label>
            <input
              {...register("tipo")}
              placeholder="Digite o tipo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.tipo && (
              <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>
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

          <button
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
