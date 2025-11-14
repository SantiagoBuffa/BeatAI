import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp1 from "./components/SignUp1";
import SignUp2 from "./components/SignUp2";
import Home from "./components/Home";
import RegistrarPaciente from "./components/RegistrarPaciente";
import VerPacientes from "./components/VerPacientes";
import Historial from "./components/Historial";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup1" element={<SignUp1 />} />
        <Route path="/signup2" element={<SignUp2 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registrar" element={<RegistrarPaciente />} />
        <Route path="/pacientes" element={<VerPacientes />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </Router>
  );
}

export default App;
