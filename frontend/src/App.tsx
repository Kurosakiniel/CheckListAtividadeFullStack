import { Login } from "./pages/Login";
import AtividadeFormPage from "./pages/AtividadeFormPage"
import { ActivitiesActive } from "./pages/ActivitiesActive";
import { ActivitiesDone } from "./pages/ActivitiesDone";
import { Home } from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RotaProtegida } from "./components/RotaProtegida";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/atividades" element={<RotaProtegida><Home /></RotaProtegida>} />
        <Route path="/atividades/ativas" element={<RotaProtegida><ActivitiesActive /></RotaProtegida>} />
        <Route path="/atividades/concluidas" element={<RotaProtegida><ActivitiesDone /></RotaProtegida>} />
        <Route path="/atividades/:id" element={<RotaProtegida><AtividadeFormPage /></RotaProtegida>} />
        <Route path="/atividades/new" element={<RotaProtegida><AtividadeFormPage /></RotaProtegida>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
