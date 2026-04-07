import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authFetch } from "../utils/authFetch";
import DialogoModal from "./DialogoModal";
import { useIdioma } from "../context/IdiomaContext";

function Sidebar() {

  let usuario = null;
  try { usuario = JSON.parse(localStorage.getItem("usuario")); } catch { /* localStorage inválido */ }
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useIdioma();

  // ── Estado modal cambiar contraseña ──
  const [modalContrasena, setModalContrasena] = useState(false);
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [contrasenaConfirmar, setContrasenaConfirmar] = useState("");
  const [mensajeContrasena, setMensajeContrasena] = useState("");
  const [errorContrasena, setErrorContrasena] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  function abrirModalContrasena() {
    setContrasenaActual("");
    setContrasenaNueva("");
    setContrasenaConfirmar("");
    setMensajeContrasena("");
    setErrorContrasena(false);
    setModalContrasena(true);
  }

  function cambiarContrasena(e) {
    e.preventDefault();

    if (contrasenaNueva !== contrasenaConfirmar) {
      setMensajeContrasena(t("contrasena.noCoinciden"));
      setErrorContrasena(true);
      return;
    }

    if (contrasenaNueva.length < 4) {
      setMensajeContrasena(t("contrasena.muyCorta"));
      setErrorContrasena(true);
      return;
    }

    authFetch(`/empleados/${usuario.id}/contrasena`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contrasenaActual: contrasenaActual,
        contrasenaNueva: contrasenaNueva
      })
    })
      .then(res => {
        if (res.ok) {
          setMensajeContrasena(t("contrasena.actualizada"));
          setErrorContrasena(false);
          setTimeout(() => setModalContrasena(false), 1500);
        } else {
          setMensajeContrasena(t("contrasena.incorrecta"));
          setErrorContrasena(true);
        }
      })
      .catch(() => {
        setMensajeContrasena(t("contrasena.error"));
        setErrorContrasena(true);
      });
  }

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
                {t("nav.inicio")}
              </Link>

              <Link to="/estadisticas" className={linkClass("/estadisticas")}>
                {t("nav.estadisticas")}
              </Link>

              <Link to="/gestion-productos" className={linkClass("/gestion-productos")}>
                {t("nav.productos")}
              </Link>

              <Link to="/gestion-empleados" className={linkClass("/gestion-empleados")}>
                {t("nav.empleados")}
              </Link>

              <Link to="/gestion-carta" className={linkClass("/gestion-carta")}>
                {t("nav.carta")}
              </Link>

              <Link to="/gestion-pedidos" className={linkClass("/gestion-pedidos")}>
                {t("nav.pedidos")}
              </Link>
            </>
          )}

          {/* CAMARERO */}
          {usuario?.tipoEmpleado === "CAMARERO" && (
            <>
              <Link to="/inicio" className={linkClass("/inicio")}>
                {t("nav.inicio")}
              </Link>

              <Link to="/pedidos" className={linkClass("/pedidos")}>
                {t("nav.pedidos")}
              </Link>
            </>
          )}

          {/* COCINA */}
          {usuario?.tipoEmpleado === "COCINERO" && (
            <>
              <Link to="/inicio" className={linkClass("/inicio")}>
                {t("nav.inicio")}
              </Link>

              <Link to="/cocina" className={linkClass("/cocina")}>
                {t("nav.cocina")}
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

        <button onClick={abrirModalContrasena} className="text-sm text-gray-600 hover:text-black">
          {t("nav.cambiarContrasena")}
        </button>

        {usuario?.tipoEmpleado === "GERENTE" && (
          <Link to="/configuracion" className="text-sm text-gray-600 hover:text-black block mt-2">
            {t("nav.configuracion")}
          </Link>
        )}

        <button
          onClick={logout}
          className="text-sm text-red-500 block mt-2 hover:text-red-600"
        >
          {t("cerrarSesion")}
        </button>

      </div>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      <DialogoModal
        abierto={modalContrasena}
        titulo={t("contrasena.titulo")}
        onCerrar={() => setModalContrasena(false)}
        maxAncho="max-w-md"
      >
        <form onSubmit={cambiarContrasena} className="space-y-4">

          {mensajeContrasena && (
            <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
              errorContrasena
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}>
              {mensajeContrasena}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {t("contrasena.actual")}
            </label>
            <input
              type="password"
              value={contrasenaActual}
              onChange={e => setContrasenaActual(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {t("contrasena.nueva")}
            </label>
            <input
              type="password"
              value={contrasenaNueva}
              onChange={e => setContrasenaNueva(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {t("contrasena.confirmar")}
            </label>
            <input
              type="password"
              value={contrasenaConfirmar}
              onChange={e => setContrasenaConfirmar(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalContrasena(false)}
              className="btn btn-outline"
            >
              {t("cancelar")}
            </button>
            <button type="submit" className="btn btn-primary">
              {t("guardar")}
            </button>
          </div>

        </form>
      </DialogoModal>

    </aside>
  );
}

export default Sidebar;