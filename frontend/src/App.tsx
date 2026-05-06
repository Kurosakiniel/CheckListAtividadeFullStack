import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import AtividadeFormPage from "./pages/AtividadeFormPage";
import { ActivitiesActive } from "./pages/ActivitiesActive";
import { ActivitiesDone } from "./pages/ActivitiesDone";
import { Home } from "./pages/Home";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* 1. LISTA - Colocada antes para evitar conflitos */}
        <Route
          path="/atividades"
          element={
            <PrivateRoute>
              <ActivitiesActive />
            </PrivateRoute>
          }
        />

        {/* 2. CONCLUÍDAS - Rota estática específica */}
        <Route
          path="/atividades/concluidas"
          element={
            <PrivateRoute>
              <ActivitiesDone />
            </PrivateRoute>
          }
        />

        {/* 3. NEW - A ROTA ESTRITA VEM ANTES DA DINÂMICA (:id) */}
        {/* Se carregar o formulário quando for pra ser lista, o erro era aqui */}
        <Route
          path="/atividades/new"
          element={
            <PrivateRoute>
              <AtividadeFormPage />
            </PrivateRoute>
          }
        />

        {/* 4. ID - A ROTA DINÂMICA SEMPRE POR ÚLTIMO */}
        <Route
          path="/atividades/:id"
          element={
            <PrivateRoute>
              <AtividadeFormPage />
            </PrivateRoute>
          }
        />

        {/* Rota de fallback: se digitar qualquer coisa errada, vai pro home */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;