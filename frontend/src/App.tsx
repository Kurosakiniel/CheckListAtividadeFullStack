import { Login } from "./pages/Login";
import AtividadeFormPage from "./pages/AtividadeFormPage"
import { ActivitiesActive } from "./pages/ActivitiesActive";
import { ActivitiesDone } from "./pages/ActivitiesDone";
import { Home } from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/atividades" element={<Home />} />
        <Route path="/atividades/ativas" element={<ActivitiesActive />} />
        <Route path="/atividades/concluidas" element={<ActivitiesDone />} />
        <Route path="/atividades/:id" element={<AtividadeFormPage />} />
        <Route path="/atividades/new" element={<AtividadeFormPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
