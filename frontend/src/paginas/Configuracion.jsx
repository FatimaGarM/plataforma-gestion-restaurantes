import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";

function Configuracion() {

  // ── Estado configuración restaurante ──
  const [nombreRestaurante, setNombreRestaurante] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [emailContacto, setEmailContacto] = useState("");
  const [urlClientePublica, setUrlClientePublica] = useState("");
  const [colorPrimario, setColorPrimario] = useState("#f59e0b");
  const [colorSecundario, setColorSecundario] = useState("#059669");
  const [idiomaEs, setIdiomaEs] = useState(true);
  const [idiomaEn, setIdiomaEn] = useState(false);
  const [logo, setLogo] = useState(null);
  const [imagenFondo, setImagenFondo] = useState(null);
  const [logoActual, setLogoActual] = useState("");
  const [fondoActual, setFondoActual] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const { t } = useIdioma();

  // ── Cargar configuración al montar ──
  useEffect(() => {
    authFetch("/configuracion")
      .then(res => res.json())
      .then(data => {
        setNombreRestaurante(data.nombreRestaurante || "");
        setTelefono(data.telefono || "");
        setDireccion(data.direccion || "");
        setEmailContacto(data.emailContacto || "");
        setUrlClientePublica(data.urlClientePublica || "");
        setColorPrimario(data.colorPrimario || "#f59e0b");
        setColorSecundario(data.colorSecundario || "#059669");
        const idiomas2 = (data.idiomaCarta || "es").split(",");
        setIdiomaEs(idiomas2.includes("es"));
        setIdiomaEn(idiomas2.includes("en"));
        setLogoActual(data.logo || "");
        setFondoActual(data.imagenFondo || "");
      });
  }, []);

  // ── Guardar configuración ──
  function guardarConfiguracion(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const formData = new FormData();
    formData.append("nombreRestaurante", nombreRestaurante);
    formData.append("telefono", telefono);
    formData.append("direccion", direccion);
    formData.append("emailContacto", emailContacto);
    formData.append("urlClientePublica", urlClientePublica.trim());
    formData.append("colorPrimario", colorPrimario);
    formData.append("colorSecundario", colorSecundario);
    const idiomasSeleccionados = [idiomaEs && "es", idiomaEn && "en"].filter(Boolean).join(",") || "es";
    formData.append("idiomaCarta", idiomasSeleccionados);

    if (logo) formData.append("logo", logo);
    if (imagenFondo) formData.append("imagenFondo", imagenFondo);

    authFetch("/configuracion", {
      method: "PUT",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setLogoActual(data.logo || "");
        setFondoActual(data.imagenFondo || "");
        setLogo(null);
        setImagenFondo(null);
        setMensaje(t("config.guardado"));
        setGuardando(false);
        window.dispatchEvent(new Event("configuracionActualizada"));
      })
      .catch(() => {
        setMensaje(t("config.error"));
        setGuardando(false);
      });
  }

  function cancelar() {
    authFetch("/configuracion")
      .then(res => res.json())
      .then(data => {
        setNombreRestaurante(data.nombreRestaurante || "");
        setTelefono(data.telefono || "");
        setDireccion(data.direccion || "");
        setEmailContacto(data.emailContacto || "");
        setUrlClientePublica(data.urlClientePublica || "");
        setColorPrimario(data.colorPrimario || "#f59e0b");
        setColorSecundario(data.colorSecundario || "#059669");
        const idiomas2 = (data.idiomaCarta || "es").split(",");
        setIdiomaEs(idiomas2.includes("es"));
        setIdiomaEn(idiomas2.includes("en"));
        setLogoActual(data.logo || "");
        setFondoActual(data.imagenFondo || "");
        setLogo(null);
        setImagenFondo(null);
        setMensaje("");
      });
  }

  return (
    <div>

      {/* TÍTULO */}
      <div className="mb-6">
        <span className="inline-block bg-amber-400 text-white text-lg font-semibold px-5 py-2 rounded-lg">
          {t("config.titulo")}
        </span>
      </div>

      {mensaje && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
          mensaje.includes("Error")
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={guardarConfiguracion}>

        {/* ═══════ FILA PRINCIPAL: INFO + LOGO/IDIOMA ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* ── IZQUIERDA: Información del restaurante ── */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 underline underline-offset-4">
              {t("config.infoRestaurante")}
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("config.nombreRestaurante")}
                </label>
                <input
                  type="text"
                  value={nombreRestaurante}
                  onChange={e => setNombreRestaurante(e.target.value)}
                  placeholder={t("config.placeholderNombre")}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("config.telefono")}
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  placeholder={t("config.placeholderTelefono")}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("config.direccion")}
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  placeholder={t("config.placeholderDireccion")}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("config.emailContacto")}
                </label>
                <input
                  type="email"
                  value={emailContacto}
                  onChange={e => setEmailContacto(e.target.value)}
                  placeholder={t("config.placeholderEmail")}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campo adicional para escanear el QR sin desplegar la aplicacion
                </label>
                <input
                  type="url"
                  value={urlClientePublica}
                  onChange={e => setUrlClientePublica(e.target.value)}
                  placeholder="http://192.168.1.50:5173"
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pega aqui la URL publica o local que deben abrir los moviles al escanear el QR. Ejemplo: `https://tu-tunel.ngrok-free.dev` o `http://192.168.X.X:5173`
                </p>
              </div>

            </div>
          </div>

          {/* ── DERECHA: Logo + Idioma ── */}
          <div className="space-y-6">

            {/* LOGO */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 underline underline-offset-4">
                {t("config.logo")}
              </h2>

              <div className="flex items-center gap-5">

                {/* Preview del logo */}
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-amber-300 flex items-center justify-center overflow-hidden bg-amber-50">
                  {logo ? (
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="Preview logo"
                      className="w-full h-full object-cover"
                    />
                  ) : logoActual ? (
                    <img
                      src={`/uploads/Configuracion/${logoActual}`}
                      alt="Logo actual"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-amber-400 text-xs text-center px-2">{t("config.sinLogo")}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="btn btn-outline cursor-pointer text-center">
                    {t("config.cambiarLogo")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setLogo(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

              </div>
            </div>

            {/* IDIOMA DE LA CARTA */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 underline underline-offset-4">
                {t("config.idiomaCartaTitulo")}
              </h2>

              <div className="flex items-start gap-8">

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={idiomaEs}
                      onChange={e => setIdiomaEs(e.target.checked)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="text-sm">{t("config.español")}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={idiomaEn}
                      onChange={e => setIdiomaEn(e.target.checked)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="text-sm">{t("config.ingles")}</span>
                  </label>
                </div>

                <p className="text-xs text-gray-400 italic max-w-[180px]">
                  {t("config.clientePuedeCambiar")}
                </p>

              </div>
            </div>

          </div>

        </div>

        {/* ═══════ PERSONALIZACIÓN VISUAL ═══════ */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 underline underline-offset-4">
            {t("config.personalizacionVisual")} <span className="text-sm font-normal text-gray-400">{t("config.aplicaACarta")}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Color primario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("config.colorPrimario")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorPrimario}
                  onChange={e => setColorPrimario(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={colorPrimario}
                  onChange={e => setColorPrimario(e.target.value)}
                  className="input flex-1"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Color secundario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("config.colorSecundario")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorSecundario}
                  onChange={e => setColorSecundario(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={colorSecundario}
                  onChange={e => setColorSecundario(e.target.value)}
                  className="input flex-1"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Imagen de fondo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("config.imagenFondo")}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImagenFondo(e.target.files[0])}
                className="input"
              />

              {/* Preview */}
              <div className="mt-2">
                {imagenFondo ? (
                  <img
                    src={URL.createObjectURL(imagenFondo)}
                    alt="Preview fondo"
                    className="w-full max-h-40 rounded-lg object-cover border"
                  />
                ) : fondoActual ? (
                  <img
                    src={`/uploads/Configuracion/${fondoActual}`}
                    alt="Fondo actual"
                    className="w-full max-h-40 rounded-lg object-cover border"
                  />
                ) : null}
              </div>
            </div>

          </div>

          {/* Preview de colores */}
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <span className="text-sm text-gray-500">{t("config.vistaPrevia")}</span>
            <div
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: colorPrimario }}
            >
              {t("config.colorPrimarioLabel")}
            </div>
            <div
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: colorSecundario }}
            >
              {t("config.colorSecundarioLabel")}
            </div>
            <button
              type="button"
              onClick={() => { setColorPrimario("#f59e0b"); setColorSecundario("#059669"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition border border-gray-200"
            >
              <RotateCcw size={14} /> Diseño por defecto
            </button>
          </div>
        </div>

        {/* ═══════ BOTONES ═══════ */}
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={guardando}
            className="btn btn-success px-8"
          >
            {guardando ? t("config.guardando") : t("config.guardarCambios")}
          </button>
          <button
            type="button"
            onClick={cancelar}
            className="btn btn-outline px-8"
          >
            {t("cancelar")}
          </button>
        </div>

      </form>
    </div>
  );
}

export default Configuracion;
