import { useEffect, useState } from "react";
import deleteIcon from "../assets/iconos/eliminar.png";

function GestionarEmpleados() {

  const [empleados, setEmpleados] = useState([]);

  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [tipoEmpleado, setTipoEmpleado] = useState("");
  const [estado, setEstado] = useState("");
  const [imagen, setImagen] = useState(null);
  const [editar, setEditar] = useState(false);

  //  filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  //  paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 5;

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // reset página al filtrar
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroRol, filtroEstado]);

  function cargarEmpleados() {
    fetch("/empleados")
      .then(res => res.json())
      .then(data => setEmpleados(data));
  }

  function limpiar() {
    setId(null);
    setNombre("");
    setEmail("");
    setContraseña("");
    setTipoEmpleado("");
    setEstado("");
    setImagen(null);
    setEditar(false);
  }

  function editarEmpleado(id) {
    setEditar(true);

    fetch(`/empleados/${id}`)
      .then(res => res.json())
      .then(data => {
        setId(id);
        setNombre(data.nombre);
        setEmail(data.email);
        setTipoEmpleado(data.tipoEmpleado);
        setEstado(data.estado);
      });
  }

  function guardarEmpleado(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("contraseña", contraseña);
    formData.append("tipoEmpleado", tipoEmpleado);
    formData.append("estado", estado);

    if (imagen) formData.append("imagen", imagen);

    const url = id ? `/empleados/actualizar/${id}` : "/empleados/con-imagen";
    const method = id ? "PUT" : "POST";

    fetch(url, {
      method,
      body: formData
    }).then(() => {
      cargarEmpleados();
      limpiar();
    });
  }

  function eliminarEmpleado(id) {
    fetch(`/empleados/${id}`, { method: "DELETE" })
      .then(() => cargarEmpleados());
  }

  function estadoColor(estado) {
    if (estado === "Activo") return "bg-green-100 text-green-700";
    if (estado === "Descanso") return "bg-gray-200 text-gray-700";
    if (estado === "Vacaciones") return "bg-orange-100 text-orange-700";
    return "";
  }

  // FILTRADO
  const empleadosFiltrados = empleados.filter(emp => {
    return (
      emp.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (filtroRol === "" || emp.tipoEmpleado === filtroRol) &&
      (filtroEstado === "" || emp.estado === filtroEstado)
    );
  });

  //  PAGINACIÓN
  const indexUltimo = paginaActual * porPagina;
  const indexPrimero = indexUltimo - porPagina;

  const empleadosPaginados = empleadosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(empleadosFiltrados.length / porPagina);

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Empleados
      </h1>

      <div className="flex gap-6">

       
        <div className="w-80 rounded-2xl p-5 shadow-md border 
        bg-gradient-to-br from-emerald-50 to-green-100">

          <h2 className="font-semibold mb-4 text-gray-800">
            {editar ? "Editar empleado" : "Añadir empleado"}
          </h2>

          <form onSubmit={guardarEmpleado} className="flex flex-col gap-3">

            <input
              type="text"
              placeholder="Nombre..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm"
              required
            />

            <input
              type="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm"
              required
            />

            {!editar && (
              <input
                type="password"
                placeholder="Contraseña..."
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="bg-white border px-4 py-2 rounded-lg text-sm"
                required
              />
            )}

            <select
              value={tipoEmpleado}
              onChange={(e) => setTipoEmpleado(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm"
              required
            >
              <option value="">Seleccionar rol</option>
              <option value="Camarero">Camarero</option>
              <option value="Cocinero">Cocinero</option>
              <option value="Gerente">Gerente</option>
            </select>

            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm"
              required
            >
              <option value="">Seleccionar estado</option>
              <option value="Activo">Activo</option>
              <option value="Descanso">Descanso</option>
              <option value="Vacaciones">Vacaciones</option>
            </select>

            <input
              type="file"
              onChange={(e) => setImagen(e.target.files[0])}
              className="bg-white border px-3 py-2 rounded-lg text-sm"
            />

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition mt-2">
              {editar ? "Actualizar" : "Añadir empleado"}
            </button>

          </form>

        </div>

        {/* 🔵 LISTADO */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden">

          {/* FILTROS */}
          <div className="flex gap-3 p-4 border-b">

            <input
              type="text"
              placeholder="Buscar empleado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
            />

            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
            >
              <option value="">Todos los roles</option>
              <option value="Camarero">Camarero</option>
              <option value="Cocinero">Cocinero</option>
              <option value="Gerente">Gerente</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Descanso">Descanso</option>
              <option value="Vacaciones">Vacaciones</option>
            </select>

          </div>

          {/* TABLA */}
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Empleado</th>
                <th className="p-3 text-left">Rol</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>

              {empleadosPaginados.map(emp => (

                <tr key={emp.id} className="border-t hover:bg-gray-50">

                  <td className="p-3">
                    <div className="flex items-center gap-3">

                      <img
                        src={`/uploads/FotosEmpleados/${emp.imagen}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-medium">{emp.nombre}</p>
                        <p className="text-xs text-gray-400">{emp.email}</p>
                      </div>

                    </div>
                  </td>

                  <td className="p-3">{emp.tipoEmpleado}</td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${estadoColor(emp.estado)}`}>
                      {emp.estado}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => editarEmpleado(emp.id)}
                        className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
                      >
                        Editar
                      </button>

                      <button onClick={() => eliminarEmpleado(emp.id)}>
                        <img src={deleteIcon} className="w-5 h-5" />
                      </button>

                    </div>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* 📄 PAGINACIÓN */}
          <div className="p-4 border-t flex justify-between items-center text-sm">

            <span className="text-gray-500">
              Mostrando {empleadosPaginados.length} de {empleadosFiltrados.length} empleados
            </span>

            <div className="flex items-center gap-2">

              <button
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                ←
              </button>

              <span>
                {paginaActual} / {totalPaginas || 1}
              </span>

              <button
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                →
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default GestionarEmpleados;