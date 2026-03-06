import { BrowserRouter, Routes, Route } from "react-router-dom";
import GestionCarta from "./paginas/GestionarCarta";
import GestionarEmpleados from "./paginas/GestionarEmpleados";
import Header from "./componentes/Header";
import Sidebar from "./componentes/Sidebar";
import Footer from "./componentes/Footer";

function App() {
  return (
    <BrowserRouter>

      <Header />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-6">

          <Routes>
            <Route path="/gestion-carta" element={<GestionCarta />} />
            <Route path="/gestion-empleados" element={<GestionarEmpleados />} />
          </Routes>

        </div>

      </div>

      <Footer />

    </BrowserRouter>
  );
}

export default App;