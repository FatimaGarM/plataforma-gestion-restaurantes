import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import deleteIcon from "../assets/iconos/eliminar.png";
import { useIdioma } from "../context/IdiomaContext";

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

  // filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 5;
  const { t } = useIdioma();

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroRol, filtroEstado]);

  function cargarEmpleados() {
    authFetch("/empleados")
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

    authFetch(`/empleados/${id}`)
      .then(res => res.json())
      .then(data => {
        setId(id);
        setNombre(data.nombre);
        setEmail(data.email);
        setTipoEmpleado(data.tipoEmpleado);
        setEstado(data.estado);
        setContraseña(""); // reset contraseña
      });
  }

  function guardarEmpleado(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);

    if (contraseña) {
      formData.append("contraseña", contraseña);
    }

    formData.append("tipoEmpleado", tipoEmpleado);
    formData.append("estado", estado);

    if (imagen) {
      formData.append("imagen", imagen);
    }

    const url = id ? `/empleados/${id}` : "/empleados/con-imagen";
    const method = id ? "PUT" : "POST";

    authFetch(url, {
      method,
      body: formData
    }).then(() => {
      cargarEmpleados();
      limpiar();
    });
  }

  function eliminarEmpleado(id) {
    authFetch(`/empleados/${id}`, { method: "DELETE" })
      .then(() => cargarEmpleados());
  }

  function estadoColor(estado) {
    if (estado === "ACTIVO") return "bg-green-100 text-green-700";
    if (estado === "DESCANSO") return "bg-gray-200 text-gray-700";
    if (estado === "VACACIONES") return "bg-orange-100 text-orange-700";
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

  // PAGINACIÓN
  const indexUltimo = paginaActual * porPagina;
  const indexPrimero = indexUltimo - porPagina;

  const empleadosPaginados = empleadosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(empleadosFiltrados.length / porPagina);

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">
        {t("empleados.titulo")}
      </h1>

      <div className="flex gap-6">

        {/* FORMULARIO */}
        <div className={`w-80 rounded-2xl p-5 shadow-md border transition-colors
        ${editar ? "bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200" : "bg-gradient-to-br from-emerald-50 to-green-100"}`}>

          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-semibold ${editar ? "text-amber-800" : "text-gray-800"}`}>
              {editar ? t("empleados.editar") : t("empleados.añadir")}
            </h2>
            {editar && (
              <button
                type="button"
                onClick={limpiar}
                className="text-xs text-amber-700 hover:text-amber-900 underline"
              >
                {t("empleados.cancelar")}
              </button>
            )}
          </div>

          <form onSubmit={guardarEmpleado} className="flex flex-col gap-3">

            <input
              type="text"
              placeholder={t("empleados.nombre")}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm"
              required
            />

            <input
              type="email"
              placeholder={t("empleados.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm"
              required
            />

            {!editar && (
              <input
                type="password"
                placeholder={t("empleados.contrasena")}
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
              <option value="">{t("empleados.seleccionarRol")}</option>
              <option value="CAMARERO">{t("empleados.camarero")}</option>
              <option value="COCINERO">{t("empleados.cocinero")}</option>
              <option value="GERENTE">{t("empleados.gerente")}</option>
            </select>

            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm"
              required
            >
              <option value="">{t("empleados.seleccionarEstado")}</option>
              <option value="ACTIVO">{t("empleados.activo")}</option>
              <option value="DESCANSO">{t("empleados.descanso")}</option>
              <option value="VACACIONES">{t("empleados.vacaciones")}</option>
            </select>

            <input
              type="file"
              onChange={(e) => setImagen(e.target.files[0])}
              className="bg-white border px-3 py-2 rounded-lg text-sm"
            />

            <button className={`${editar ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"} text-white py-2 rounded-lg font-medium transition mt-2`}>
              {editar ? t("empleados.actualizar") : t("empleados.añadir")}
            </button>

          </form>

        </div>

        {/* LISTADO */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden">

          {/* FILTROS */}
          <div className="flex gap-3 p-4 border-b">

            <input
              type="text"
              placeholder={t("empleados.buscar")}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
            />

            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
            >
              <option value="">{t("empleados.todosRoles")}</option>
              <option value="CAMARERO">{t("empleados.camarero")}</option>
              <option value="COCINERO">{t("empleados.cocinero")}</option>
              <option value="GERENTE">{t("empleados.gerente")}</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
            >
              <option value="">{t("empleados.todosEstados")}</option>
              <option value="ACTIVO">{t("empleados.activo")}</option>
              <option value="DESCANSO">{t("empleados.descanso")}</option>
              <option value="VACACIONES">{t("empleados.vacaciones")}</option>
            </select>

          </div>

          {/* TABLA */}
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">{t("empleados.columnaEmpleado")}</th>
                <th className="p-3 text-left">{t("empleados.columnaRol")}</th>
                <th className="p-3 text-left">{t("empleados.columnaEstado")}</th>
                <th className="p-3 text-left">{t("carta.acciones")}</th>
              </tr>
            </thead>

            <tbody>

              {empleadosPaginados.map(emp => (

                <tr key={emp.id} className="border-t hover:bg-gray-50">

                  <td className="p-3">
                    <div className="flex items-center gap-3">

                      <img
                        src={emp.imagen ? `/uploads/FotosEmpleados/${emp.imagen}` : "/default-user.png"}
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

          {/* PAGINACIÓN */}
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