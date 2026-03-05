import { BrowserRouter, Routes, Route } from "react-router-dom";
import GestionCarta from "./paginas/GestionarCarta";
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
          </Routes>

        </div>

      </div>

      <Footer />

    </BrowserRouter>
  );
}

export default App;