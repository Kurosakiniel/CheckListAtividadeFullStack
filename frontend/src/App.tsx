import { Login } from "./pages/Login";
import AtividadeFormPage from "./pages/AtividadeFormPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/atividades" element={<Login />} />
        <Route path="/atividades/new" element={<AtividadeFormPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
