import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp1 from "./components/SignUp1";
import SignUp2 from "./components/SignUp2";
import Home from "./components/Home";
import RegistrarPaciente from "./components/RegistrarPaciente";
import VerPacientes from "./components/VerPacientes";
import Historial from "./components/Historial";
import MenuLayout from "./components/MenuLayout";
import Perfil from "./components/Perfil"; 


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin layout (sin menú) */}
        <Route path="/" element={<Login />} />
        <Route path="/signup1" element={<SignUp1 />} />
        <Route path="/signup2" element={<SignUp2 />} />

        {/* Rutas con layout (con menú lateral) */}
        <Route
          path="/home"
          element={
            <MenuLayout>
              <Home />
            </MenuLayout>
          }
        />
        <Route
          path="/miperfil"
          element={
            <MenuLayout>
              <Perfil />
            </MenuLayout>
          }
        />
        <Route
          path="/registrar"
          element={
            <MenuLayout>
              <RegistrarPaciente />
            </MenuLayout>
          }
        />
        <Route
          path="/pacientes"
          element={
            <MenuLayout>
              <VerPacientes />
            </MenuLayout>
          }
        />
        <Route
          path="/historial/:dni"
          element={
            <MenuLayout>
              <Historial />
            </MenuLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
