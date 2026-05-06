import {Login} from "./pages/Login";
import AtividadeFormPage from "./pages/AtividadeFormPage";
import { ActivitiesActive } from "./pages/ActivitiesActive";
import {ActivitiesDone} from "./pages/ActivitiesDone";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/atividades" element={<ActivitiesActive />} />
        <Route path="/atividades/concluidas" element={<ActivitiesDone />} />
        <Route path="/atividades/:id" element={<AtividadeFormPage />} />
        <Route path="/atividades/new" element={<AtividadeFormPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;