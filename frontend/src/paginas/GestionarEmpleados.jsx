import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import deleteIcon from "../assets/iconos/eliminar.png";
import { useIdioma } from "../context/IdiomaContext";
import ConfirmacionEliminar from "../componentes/ConfirmacionEliminar";

const COLORES_AVATAR = ["bg-amber-500","bg-emerald-500","bg-blue-500","bg-purple-500","bg-rose-500","bg-teal-500","bg-orange-500","bg-indigo-500"];
function colorAvatar(nombre) { return COLORES_AVATAR[(nombre?.charCodeAt(0) || 0) % COLORES_AVATAR.length]; }

function AvatarEmpleado({ imagen, nombre }) {
  const [error, setError] = useState(false);
  if (imagen && !error) {
    return <img src={`/uploads/FotosEmpleados/${imagen}`} onError={() => setError(true)} className="w-10 h-10 rounded-full object-cover" />;
  }
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${colorAvatar(nombre)}`}>
      {nombre?.charAt(0)?.toUpperCase()}
    </div>
  );
}

function GestionarEmpleados() {

  const [empleados, setEmpleados] = useState([]);

  // formulario ANADIR (lateral)
  const [nombreNew, setNombreNew] = useState("");
  const [emailNew, setEmailNew] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [tipoNew, setTipoNew] = useState("");
  const [estadoNew, setEstadoNew] = useState("");
  const [imagenNew, setImagenNew] = useState(null);

  // formulario EDITAR (modal)
  const [modalEditar, setModalEditar] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [tipoEdit, setTipoEdit] = useState("");
  const [estadoEdit, setEstadoEdit] = useState("");
  const [imagenEdit, setImagenEdit] = useState(null);

  // eliminar
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

  // filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // paginacion
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 5;

  // toast
  const [toast, setToast] = useState(null);

  const { t } = useIdioma();

  useEffect(() => { cargarEmpleados(); }, []);
  useEffect(() => { setPaginaActual(1); }, [busqueda, filtroRol, filtroEstado]);

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 3000);
  }

  function cargarEmpleados() {
    authFetch("/empleados").then(r => r.json()).then(setEmpleados);
  }

  function limpiarNew() {
    setNombreNew(""); setEmailNew(""); setPasswordNew("");
    setTipoNew(""); setEstadoNew(""); setImagenNew(null);
  }

  function anadirEmpleado(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nombre", nombreNew);
    fd.append("email", emailNew);
    fd.append("contrase\u00f1a", passwordNew);
    fd.append("tipoEmpleado", tipoNew);
    fd.append("estado", estadoNew);
    if (imagenNew) fd.append("imagen", imagenNew);

    authFetch("/empleados/con-imagen", { method: "POST", body: fd })
      .then(() => { cargarEmpleados(); limpiarNew(); mostrarToast(t("empleados.toastAnadido")); });
  }

  function abrirEditar(empId) {
    authFetch(`/empleados/${empId}`).then(r => r.json()).then(data => {
      setIdEdit(empId);
      setNombreEdit(data.nombre);
      setEmailEdit(data.email);
      setTipoEdit(data.tipoEmpleado);
      setEstadoEdit(data.estado);
      setImagenEdit(null);
      setModalEditar(true);
    });
  }

  function guardarEdicion(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nombre", nombreEdit);
    fd.append("email", emailEdit);
    fd.append("tipoEmpleado", tipoEdit);
    fd.append("estado", estadoEdit);
    if (imagenEdit) fd.append("imagen", imagenEdit);

    authFetch(`/empleados/${idEdit}`, { method: "PUT", body: fd })
      .then(r => r.json())
      .then(actualizado => {
        cargarEmpleados();
        setModalEditar(false);
        mostrarToast(t("empleados.toastEditado"));
        // Si el empleado editado es el usuario logueado, actualizar localStorage
        try {
          const sesion = JSON.parse(localStorage.getItem("usuario"));
          if (sesion && sesion.id === actualizado.id) {
            localStorage.setItem("usuario", JSON.stringify(actualizado));
            window.dispatchEvent(new Event("usuarioActualizado"));
          }
        } catch { }
      });
  }

  function eliminarEmpleado(id) {
    authFetch(`/empleados/${id}`, { method: "DELETE" })
      .then(() => { cargarEmpleados(); setEmpleadoAEliminar(null); });
  }

  function estadoColor(est) {
    if (est === "ACTIVO") return "bg-green-100 text-green-700";
    if (est === "DESCANSO") return "bg-gray-200 text-gray-700";
    if (est === "VACACIONES") return "bg-orange-100 text-orange-700";
    return "";
  }

  function rolLabel(rol) {
    const map = { CAMARERO: "empleados.camarero", COCINERO: "empleados.cocinero", GERENTE: "empleados.gerente" };
    return map[rol] ? t(map[rol]) : rol;
  }

  function estadoLabel(est) {
    const map = { ACTIVO: "empleados.activo", DESCANSO: "empleados.descanso", VACACIONES: "empleados.vacaciones" };
    return map[est] ? t(map[est]) : est;
  }

  const empleadosFiltrados = empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (filtroRol === "" || emp.tipoEmpleado === filtroRol) &&
    (filtroEstado === "" || emp.estado === filtroEstado)
  );

  const indexUltimo = paginaActual * porPagina;
  const indexPrimero = indexUltimo - porPagina;
  const empleadosPaginados = empleadosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(empleadosFiltrados.length / porPagina);

  return (
    <>
    <div className="bg-gray-50 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">{t("empleados.titulo")}</h1>

      <div className="flex gap-6">

        {/* FORMULARIO ANADIR */}
        <div className="w-80 shrink-0 rounded-2xl p-5 shadow-md border bg-gradient-to-br from-emerald-50 to-green-100">
          <h2 className="font-semibold text-gray-800 mb-4">{t("empleados.anadir")}</h2>
          <form onSubmit={anadirEmpleado} className="flex flex-col gap-3">
            <input type="text" placeholder={t("empleados.nombre")} value={nombreNew}
              onChange={e => setNombreNew(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-300" required />
            <input type="email" placeholder={t("empleados.email")} value={emailNew}
              onChange={e => setEmailNew(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-300" required />
            <input type="password" placeholder={t("empleados.contrasena")} value={passwordNew}
              onChange={e => setPasswordNew(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-300" required />
            <select value={tipoNew} onChange={e => setTipoNew(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm" required>
              <option value="">{t("empleados.seleccionarRol")}</option>
              <option value="CAMARERO">{t("empleados.camarero")}</option>
              <option value="COCINERO">{t("empleados.cocinero")}</option>
              <option value="GERENTE">{t("empleados.gerente")}</option>
            </select>
            <select value={estadoNew} onChange={e => setEstadoNew(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm" required>
              <option value="">{t("empleados.seleccionarEstado")}</option>
              <option value="ACTIVO">{t("empleados.activo")}</option>
              <option value="DESCANSO">{t("empleados.descanso")}</option>
              <option value="VACACIONES">{t("empleados.vacaciones")}</option>
            </select>
            <input type="file" onChange={e => setImagenNew(e.target.files[0])}
              className="bg-white border px-3 py-2 rounded-lg text-sm" />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition mt-2">
              {t("empleados.anadir")}
            </button>
          </form>
        </div>

        {/* TABLA */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden">

          <div className="flex gap-3 p-4 border-b">
            <input type="text" placeholder={t("empleados.buscar")} value={busqueda}
              onChange={e => setBusqueda(e.target.value)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm" />
            <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
              <option value="">{t("empleados.todosRoles")}</option>
              <option value="CAMARERO">{t("empleados.camarero")}</option>
              <option value="COCINERO">{t("empleados.cocinero")}</option>
              <option value="GERENTE">{t("empleados.gerente")}</option>
            </select>
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
              <option value="">{t("empleados.todosEstados")}</option>
              <option value="ACTIVO">{t("empleados.activo")}</option>
              <option value="DESCANSO">{t("empleados.descanso")}</option>
              <option value="VACACIONES">{t("empleados.vacaciones")}</option>
            </select>
          </div>

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
                      <AvatarEmpleado imagen={emp.imagen} nombre={emp.nombre} />
                      <div>
                        <p className="font-medium">{emp.nombre}</p>
                        <p className="text-xs text-gray-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{rolLabel(emp.tipoEmpleado)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${estadoColor(emp.estado)}`}>{estadoLabel(emp.estado)}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => abrirEditar(emp.id)}
                        className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100">
                        {t("editar")}
                      </button>
                      <button onClick={() => setEmpleadoAEliminar(emp)}>
                        <img src={deleteIcon} className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 border-t flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {t("empleados.mostrando") || "Mostrando"} {empleadosPaginados.length} / {empleadosFiltrados.length}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}
                className="px-3 py-1 border rounded disabled:opacity-40">&#8592;</button>
              <span>{paginaActual} / {totalPaginas || 1}</span>
              <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas || totalPaginas === 0}
                className="px-3 py-1 border rounded disabled:opacity-40">&#8594;</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* TOAST */}
    {toast && (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg z-50">
        {toast}
      </div>
    )}

    {/* MODAL EDITAR */}
    {modalEditar && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalEditar(false)}>
        <div className="bg-white rounded-2xl p-6 w-96 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-amber-800">{t("empleados.editar")}</h2>
            <button onClick={() => setModalEditar(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>
          <form onSubmit={guardarEdicion} className="flex flex-col gap-3">
            <input type="text" placeholder={t("empleados.nombre")} value={nombreEdit}
              onChange={e => setNombreEdit(e.target.value)} autoFocus
              className="bg-white border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-300" required />
            <input type="email" placeholder={t("empleados.email")} value={emailEdit}
              onChange={e => setEmailEdit(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-300" required />
            <select value={tipoEdit} onChange={e => setTipoEdit(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm" required>
              <option value="">{t("empleados.seleccionarRol")}</option>
              <option value="CAMARERO">{t("empleados.camarero")}</option>
              <option value="COCINERO">{t("empleados.cocinero")}</option>
              <option value="GERENTE">{t("empleados.gerente")}</option>
            </select>
            <select value={estadoEdit} onChange={e => setEstadoEdit(e.target.value)}
              className="bg-white border px-4 py-2 rounded-lg text-sm" required>
              <option value="">{t("empleados.seleccionarEstado")}</option>
              <option value="ACTIVO">{t("empleados.activo")}</option>
              <option value="DESCANSO">{t("empleados.descanso")}</option>
              <option value="VACACIONES">{t("empleados.vacaciones")}</option>
            </select>
            <input type="file" onChange={e => setImagenEdit(e.target.files[0])}
              className="bg-white border px-3 py-2 rounded-lg text-sm" />
            <div className="flex gap-2 justify-end mt-2">
              <button type="button" onClick={() => setModalEditar(false)}
                className="px-4 py-2 rounded-lg text-sm border text-gray-600 hover:bg-gray-100">{t("cancelar")}</button>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm transition">
                {t("empleados.actualizar")}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    <ConfirmacionEliminar
      abierto={empleadoAEliminar !== null}
      titulo={t("empleados.eliminar")}
      mensaje={empleadoAEliminar ? `${t("carta.confirmarEliminar")} "${empleadoAEliminar.nombre}".` : ""}
      onCancelar={() => setEmpleadoAEliminar(null)}
      onConfirmar={() => eliminarEmpleado(empleadoAEliminar.id)}
    />
    </>
  );
}

export default GestionarEmpleados;