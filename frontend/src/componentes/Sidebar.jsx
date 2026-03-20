import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-56 bg-orange-100 p-4 flex flex-col justify-between">

      {/* Parte superior */}
      <nav className="flex flex-col gap-3">

        <Link to="/estadisticas" className="text-left">
          Estadísticas
        </Link>

       <Link to="/gestion-productos" className="text-left">
          Gestión de productos
        </Link>

        <Link to="/gestion-empleados" className="text-left">
          Gestión de empleados
        </Link>

        <Link to="/gestion-carta" className="text-left">
          Gestión de carta
        </Link>

        <Link to="/gestion-pedidos" className="text-left">
          Gestión de pedidos
        </Link>

      </nav>

      {/* Parte inferior , hay que mejorarla.. no se ve bien aún, implementar funcionalidades*/}
      <div className="flex flex-col gap-3 text-sm">

        <span>
          Gustavo (Gerente)
        </span>

        <button className="text-left">
          Configuración
        </button>

        <button className="text-left text-red-600">
          Salir
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;