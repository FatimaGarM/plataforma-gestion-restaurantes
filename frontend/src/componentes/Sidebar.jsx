import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {

  let usuario = null;
  try { usuario = JSON.parse(localStorage.getItem("usuario")); } catch { /* localStorage inválido */ }
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = (ruta) =>
    `flex items-center px-3 py-2 rounded-lg transition ${
      location.pathname === ruta
        ? "bg-amber-500 text-white"
        : "text-gray-700 hover:bg-amber-100"
    }`;

  return (
    <aside className="w-60 bg-[#f5f1eb] text-gray-800 flex flex-col justify-between border-r">

      {/* NAVEGACIÓN */}
      <div className="p-5">

      

        <nav className="flex flex-col gap-2">

          {/* GERENTE */}
          {usuario?.tipoEmpleado === "GERENTE" && (
            <>
              <Link to="/inicio" className={linkClass("/inicio")}>
                Inicio
              </Link>

              <Link to="/estadisticas" className={linkClass("/estadisticas")}>
                Estadísticas
              </Link>

              <Link to="/gestion-productos" className={linkClass("/gestion-productos")}>
                Productos
              </Link>

              <Link to="/gestion-empleados" className={linkClass("/gestion-empleados")}>
                Empleados
              </Link>

              <Link to="/gestion-carta" className={linkClass("/gestion-carta")}>
                Carta
              </Link>

              <Link to="/gestion-pedidos" className={linkClass("/gestion-pedidos")}>
                Pedidos
              </Link>
            </>
          )}

          {/* CAMARERO */}
          {usuario?.tipoEmpleado === "CAMARERO" && (
            <>
              <Link to="/inicio" className={linkClass("/inicio")}>
                Inicio
              </Link>

              <Link to="/pedidos" className={linkClass("/pedidos")}>
                Pedidos
              </Link>
            </>
          )}

          {/* COCINA */}
          {usuario?.tipoEmpleado === "COCINERO" && (
            <>
              <Link to="/inicio" className={linkClass("/inicio")}>
                Inicio
              </Link>

              <Link to="/cocina" className={linkClass("/cocina")}>
                Cocina
              </Link>
            </>
          )}

        </nav>

      </div>

      {/* USUARIO */}
      <div className="p-5 border-t">

        <div className="flex items-center gap-3 mb-4">

          {/* FOTO O INICIAL */}
          {usuario?.imagen ? (
            <img
              src={`http://localhost:8080/uploads/FotosEmpleados/${usuario.imagen}`}
              alt="usuario"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
              {usuario?.nombre?.charAt(0)}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold">
              {usuario?.nombre}
            </p>
            <p className="text-xs text-gray-500">
              {usuario?.tipoEmpleado}
            </p>
          </div>

        </div>

        <button className="text-sm text-gray-600 hover:text-black">
          Configuración
        </button>

        <button
          onClick={logout}
          className="text-sm text-red-500 block mt-2 hover:text-red-600"
        >
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;