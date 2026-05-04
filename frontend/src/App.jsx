import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import GestionCarta from "./paginas/GestionarCarta";
import GestionarEmpleados from "./paginas/GestionarEmpleados";
import Login from "./paginas/Login";
import Header from "./componentes/Header";
import Sidebar from "./componentes/Sidebar";
import Footer from "./componentes/Footer";
import PrivateRoute from "./componentes/PrivateRoute";
import Inicio from "./paginas/Inicio";
import GestionProductos from "./paginas/GestionProductos";
import Estadisticas from "./paginas/Estadisticas";
import GestionPedidos from "./paginas/GestionPedidos";
import PantallaCocina from "./paginas/PantallaCocina";
import PantallaCamarero from "./paginas/PantallaCamarero";
import Configuracion from "./paginas/Configuracion";
import CartaCliente from "./paginas/CartaCliente";
import CartaCamarero from "./paginas/CartaCamarero";

function Layout() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  // SI ESTÁ EN LOGIN → NO mostramos layout
  if (isLogin) {
    return (
      <Routes>
        {/* si entra a /login y YA está logueado → lo mandamos al inicio */}
        <Route
          path="/login"
          element={
            localStorage.getItem("auth")
              ? <Navigate to="/inicio" />
              : <Login />
          }
        />

        {/* por si alguien pone cualquier cosa */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // APP NORMAL (con header + sidebar)
  return (
    <>
      <Header />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          <Routes>

            {/* RUTA RAÍZ INTELIGENTE */}
            <Route
              path="/"
              element={
                localStorage.getItem("auth")
                  ? <Navigate to="/inicio" />
                  : <Navigate to="/login" />
              }
            />

            <Route
              path="/inicio"
              element={
                <PrivateRoute>
                  <Inicio />
                </PrivateRoute>
              }
            />

            <Route
              path="/gestion-productos"
              element={
                <PrivateRoute>
                  <GestionProductos />
                </PrivateRoute>
              }
            />

            <Route
              path="/gestion-carta"
              element={
                <PrivateRoute>
                  <GestionCarta />
                </PrivateRoute>
              }
            />

            <Route
              path="/gestion-empleados"
              element={
                <PrivateRoute>
                  <GestionarEmpleados />
                </PrivateRoute>
              }
            />

            <Route
              path="/estadisticas"
              element={
                <PrivateRoute>
                  <Estadisticas />
                </PrivateRoute>
              }
            />

            <Route
              path="/gestion-pedidos"
              element={
                <PrivateRoute>
                  <GestionPedidos />
                </PrivateRoute>
              }
            />

            <Route
              path="/cocina"
              element={
                <PrivateRoute>
                  <PantallaCocina />
                </PrivateRoute>
              }
            />

            <Route
              path="/pedidos"
              element={
                <PrivateRoute>
                  <PantallaCamarero />
                </PrivateRoute>
              }
            />

            <Route
              path="/configuracion"
              element={
                <PrivateRoute>
                  <Configuracion />
                </PrivateRoute>
              }
            />

            {/* cualquier ruta rara → inicio */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </div>
      </div>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vista pública del cliente — sin Header ni Sidebar */}
        <Route path="/cliente" element={<CartaCliente />} />
        {/* Vista para camareros verifica autorización — sin Header ni Sidebar */}
        <Route path="/carta"  element={
                localStorage.getItem("auth") && JSON.parse(localStorage.getItem("usuario") || "{}").tipoEmpleado === "CAMARERO"
                  ? <CartaCamarero />
                  : <Navigate to="/login" />
              } />
        {/* Todo lo demás pasa por el Layout con autenticación */}
        <Route path="*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;