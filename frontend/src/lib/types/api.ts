import axios from "axios";

// Instância do axios com a URL base da API
// Assim não precisa repetir "http://localhost:8000" em todo lugar
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// Interceptor — roda automaticamente ANTES de cada requisição
// Pega o token do localStorage e adiciona no header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de resposta — roda automaticamente em cada resposta
// Se receber 401, limpa o token e redireciona para o login
api.interceptors.response.use(
  (response) => response, // se der certo, retorna normalmente

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/"; // redireciona para o login
    }
    return Promise.reject(error);
  }
);

export default api;