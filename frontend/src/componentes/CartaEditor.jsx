import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";
import deleteIcon from "../assets/iconos/eliminar.png";

const MESAS_TOTALES = 10;

function CartaEditor() {
    const { t, idioma } = useIdioma();

    const [cartas, setCartas] = useState([]);
    const [cartaSeleccionadaId, setCartaSeleccionadaId] = useState(null);
    const [carta, setCarta] = useState(null);
    const [platos, setPlatos] = useState([]);
    const [mesaQR, setMesaQR] = useState(1);
    const [urlClientePublica, setUrlClientePublica] = useState("");
    const [seccionesAbiertas, setSeccionesAbiertas] = useState({});
    const [modalAñadir, setModalAñadir] = useState(null); // { seccionId }
    const [modalNuevaCarta, setModalNuevaCarta] = useState(false);
    const [modalNuevaSeccion, setModalNuevaSeccion] = useState(false);
    const [nombreNuevaCarta, setNombreNuevaCarta] = useState("");
    const [nombreNuevaSeccion, setNombreNuevaSeccion] = useState("");
    const [nombreEnNuevaSeccion, setNombreEnNuevaSeccion] = useState("");
    const [busquedaCarta, setBusquedaCarta] = useState("");
    const [busquedaPlato, setBusquedaPlato] = useState("");
    const [confirmarEliminarCarta, setConfirmarEliminarCarta] = useState(false);
    const [modalEditarSeccion, setModalEditarSeccion] = useState(null); // { id, nombre, nombreEn }

    const qrRef = useRef(null);

    useEffect(() => {
        cargarCartas();
        authFetch("/platos").then(r => r.json()).then(setPlatos);
        authFetch("/configuracion")
            .then(r => r.json())
            .then(data => setUrlClientePublica(data?.urlClientePublica || ""))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (cartaSeleccionadaId) cargarCarta(cartaSeleccionadaId);
    }, [cartaSeleccionadaId]);

    useEffect(() => {
        if (!busquedaCarta.trim()) return;
        const match = cartas.find(c => c.nombre.toLowerCase().includes(busquedaCarta.toLowerCase()));
        if (match) setCartaSeleccionadaId(match.id);
    }, [busquedaCarta, cartas]);

    function cargarCartas() {
        authFetch("/cartas")
            .then(r => r.json())
            .then(data => {
                setCartas(data);
                if (data.length > 0 && !cartaSeleccionadaId) {
                    setCartaSeleccionadaId(data[0].id);
                }
            });
    }

    function cargarCarta(id) {
        authFetch(`/cartas/${id}`)
            .then(r => r.json())
            .then(data => {
                setCarta(data);
                const abiertos = {};
                (data.secciones || []).forEach(s => { abiertos[s.id] = true; });
                setSeccionesAbiertas(abiertos);
            });
    }

    function toggleSeccion(id) {
        setSeccionesAbiertas(prev => ({ ...prev, [id]: !prev[id] }));
    }

    async function crearCarta() {
        if (!nombreNuevaCarta.trim()) return;
        const res = await authFetch("/cartas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombreNuevaCarta.trim() })
        });
        const nueva = await res.json();
        setNombreNuevaCarta("");
        setModalNuevaCarta(false);
        await cargarCartas();
        setCartaSeleccionadaId(nueva.id);
    }

    async function añadirSeccion() {
        if (!nombreNuevaSeccion.trim() || !cartaSeleccionadaId) return;
        await authFetch(`/cartas/${cartaSeleccionadaId}/secciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombreNuevaSeccion.trim(), nombreEn: nombreEnNuevaSeccion.trim() })
        });
        setNombreNuevaSeccion("");
        setNombreEnNuevaSeccion("");
        setModalNuevaSeccion(false);
        cargarCarta(cartaSeleccionadaId);
    }

    async function eliminarSeccion(seccionId) {
        await authFetch(`/cartas/${cartaSeleccionadaId}/secciones/${seccionId}`, { method: "DELETE" });
        cargarCarta(cartaSeleccionadaId);
    }

    async function guardarEdicionSeccion() {
        if (!modalEditarSeccion || !modalEditarSeccion.nombre.trim()) return;
        await authFetch(`/cartas/${cartaSeleccionadaId}/secciones/${modalEditarSeccion.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: modalEditarSeccion.nombre.trim(), nombreEn: modalEditarSeccion.nombreEn.trim() })
        });
        setModalEditarSeccion(null);
        cargarCarta(cartaSeleccionadaId);
    }

    async function eliminarCarta() {
        if (!cartaSeleccionadaId) return;
        await authFetch(`/cartas/${cartaSeleccionadaId}`, { method: "DELETE" });
        setConfirmarEliminarCarta(false);
        setCarta(null);
        setCartaSeleccionadaId(null);
        cargarCartas();
    }

    async function añadirPlatoASeccion(seccionId, platoId) {
        await authFetch(`/cartas/${cartaSeleccionadaId}/secciones/${seccionId}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platoId })
        });
        setModalAñadir(null);
        setBusquedaPlato("");
        cargarCarta(cartaSeleccionadaId);
    }

    async function eliminarItem(seccionId, itemId) {
        await authFetch(`/cartas/${cartaSeleccionadaId}/secciones/${seccionId}/items/${itemId}`, { method: "DELETE" });
        cargarCarta(cartaSeleccionadaId);
    }

    async function moverItem(seccionId, itemId, direccion) {
        await authFetch(`/cartas/${cartaSeleccionadaId}/secciones/${seccionId}/items/${itemId}/orden`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ direccion })
        });
        cargarCarta(cartaSeleccionadaId);
    }

    async function subirBanner(e) {
        const file = e.target.files[0];
        if (!file || !cartaSeleccionadaId) return;
        const fd = new FormData();
        fd.append("imagen", file);
        await authFetch(`/cartas/${cartaSeleccionadaId}/imagen`, { method: "POST", body: fd });
        cargarCarta(cartaSeleccionadaId);
    }

    function descargarQR() {
        const svg = qrRef.current?.querySelector("svg");
        if (!svg) return;
        const data = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([data], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qr-mesa-${mesaQR}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function imprimirQR() {
        const svg = qrRef.current?.querySelector("svg");
        if (!svg) return;
        const data = new XMLSerializer().serializeToString(svg);
        const ventana = window.open("", "_blank");
        ventana.document.write(`
            <html><head><title>QR Mesa ${mesaQR}</title></head>
            <body style="display:flex;justify-content:center;padding:40px">
                ${data}
                <script>window.onload=()=>{ window.print(); window.close(); }<\/script>
            </body></html>
        `);
        ventana.document.close();
    }

    function normalizarUrlBase(url) {
        return (url || "").trim().replace(/\/+$/, "");
    }

    const qrBaseUrl = normalizarUrlBase(urlClientePublica) || normalizarUrlBase(window.location.origin);
    const qrUrl = `${qrBaseUrl}/cliente?mesa=${mesaQR}`;

    async function activarCarta() {
        if (!cartaSeleccionadaId) return;
        const res = await authFetch(`/cartas/${cartaSeleccionadaId}/activar`, { method: "PUT" });
        if (res.ok) {
            const updated = await res.json();
            setCartas(prev => prev.map(c => ({ ...c, activa: c.id === cartaSeleccionadaId })));
            setCarta(updated);
        }
    }

    // Platos que no están ya en la sección seleccionada
    function platosDisponiblesParaSeccion(seccionId) {
        const seccion = carta?.secciones?.find(s => s.id === seccionId);
        const ids = new Set((seccion?.items || []).map(i => i.plato?.id));
        return platos.filter(p => !ids.has(p.id) && p.disponible);
    }

    return (
        <div className="flex gap-4">

            {/* PANEL PRINCIPAL */}
            <div className="flex-1 min-w-0">

                {/* BARRA SUPERIOR */}
                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="text"
                        value={busquedaCarta}
                        onChange={e => setBusquedaCarta(e.target.value)}
                        placeholder={t("carta.buscarCarta")}
                        className="bg-gray-100 px-4 py-2 rounded-lg text-sm outline-none w-44"
                    />

                    <button
                        onClick={() => setModalNuevaCarta(true)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition whitespace-nowrap"
                    >
                        {t("carta.crearNuevaCarta")}
                    </button>

                    {cartas.length > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                            <div className="relative">
                                <select
                                    value={cartaSeleccionadaId || ""}
                                    onChange={e => setCartaSeleccionadaId(Number(e.target.value))}
                                    className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm pr-8 appearance-none"
                                >
                                    {cartas
                                        .filter(c => c.nombre.toLowerCase().includes(busquedaCarta.toLowerCase()))
                                        .map(c => (
                                            <option key={c.id} value={c.id}>{c.activa ? "✓ " : ""}{c.nombre}</option>
                                        ))}
                                </select>
                                <span className="pointer-events-none absolute right-2 top-2.5 text-gray-400 text-xs">▼</span>
                            </div>
                            <button
                                onClick={() => setConfirmarEliminarCarta(true)}
                                title={t("carta.eliminarCarta")}
                                className="border border-red-200 text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm transition"
                            >
                                <img src={deleteIcon} className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {!carta ? (
                    <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
                        {cartas.length === 0 ? t("carta.sinCartas") : t("cargando")}
                    </div>
                ) : (
                    <>
                    {/* BANNER */}
                    <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-200 h-44">
                        {carta.imagenBanner ? (
                            <img
                                src={`/uploads/Cartas/${carta.imagenBanner}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                {t("carta.sinBanner")}
                            </div>
                        )}
                        <label className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 hover:bg-white text-gray-700 text-sm px-4 py-1.5 rounded-lg cursor-pointer flex items-center gap-2 shadow">
                            {t("carta.cambiarImagen")}
                            <input type="file" accept="image/*" className="hidden" onChange={subirBanner} />
                        </label>
                    </div>

                    {/* SECCIONES */}
                    {(carta.secciones || []).map(seccion => (
                        <div key={seccion.id} className="bg-white rounded-xl border mb-3 overflow-hidden">

                            {/* CABECERA SECCIÓN */}
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                                <button
                                    onClick={() => toggleSeccion(seccion.id)}
                                    className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                                >
                                    {idioma === "en" && seccion.nombreEn ? seccion.nombreEn : seccion.nombre}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setModalEditarSeccion({ id: seccion.id, nombre: seccion.nombre, nombreEn: seccion.nombreEn || "" })}
                                        className="text-gray-400 hover:text-amber-600 border border-gray-200 hover:border-amber-300 px-2 py-1 rounded-lg text-xs transition flex items-center"
                                        title={t("editar")}
                                    >
                                        <Pencil size={13} />
                                    </button>
                                    <button
                                        onClick={() => { setModalAñadir({ seccionId: seccion.id }); setBusquedaPlato(""); }}
                                        className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg text-xs"
                                    >
                                        + {t("carta.añadirPlatoSeccion")}
                                    </button>
                                    <button
                                        onClick={() => eliminarSeccion(seccion.id)}
                                        className="text-red-400 hover:text-red-600 text-lg leading-none"
                                        title={t("carta.eliminarSeccion")}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* TABLA DE PLATOS EN SECCIÓN */}
                            {seccionesAbiertas[seccion.id] && (
                                <table className="w-full text-sm">
                                    <thead className="text-gray-500 text-xs border-b bg-white">
                                        <tr>
                                            <th className="text-left px-4 py-2 w-8"></th>
                                            <th className="text-left px-4 py-2">{idioma === "en" && seccion.nombreEn ? seccion.nombreEn : seccion.nombre}</th>
                                            <th className="text-left px-4 py-2">{t("carta.precio")}</th>
                                            <th className="text-left px-4 py-2">{t("carta.eliminar")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(seccion.items || []).map((item, idx) => (
                                            <tr key={item.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <button
                                                            onClick={() => moverItem(seccion.id, item.id, "subir")}
                                                            disabled={idx === 0}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▲</button>
                                                        <button
                                                            onClick={() => moverItem(seccion.id, item.id, "bajar")}
                                                            disabled={idx === seccion.items.length - 1}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▼</button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        {item.plato?.imagen
                                                            ? <img src={`/uploads/FotoPlatos/${item.plato.imagen}`} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                            : <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                                                        }
                                                        <span>{idioma === "en" && item.plato?.nombreEn ? item.plato.nombreEn : item.plato?.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">{item.plato?.precio} €</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => eliminarItem(seccion.id, item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <img src={deleteIcon} className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(seccion.items || []).length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-3 text-gray-400 text-xs text-center">
                                                    {t("carta.seccionVacia")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}

                    {/* BOTÓN AÑADIR SECCIÓN */}
                    <button
                        onClick={() => setModalNuevaSeccion(true)}
                        className="mt-2 w-full border-2 border-dashed border-gray-300 hover:border-emerald-400 text-gray-400 hover:text-emerald-600 rounded-xl py-3 text-sm transition"
                    >
                        {t("carta.añadirSeccion")}
                    </button>
                    </>
                )}
            </div>

            {/* PANEL QR */}
            <div className="w-64 shrink-0">
                <div className="bg-white border-2 border-teal-400 rounded-xl p-4 sticky top-6">
                    <h3 className="font-semibold text-gray-700 mb-3 text-center">{t("carta.codigoQR")}</h3>

                    <select
                        value={mesaQR}
                        onChange={e => setMesaQR(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm mb-4"
                    >
                        {Array.from({ length: MESAS_TOTALES }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{t("carta.mesa")} {n}</option>
                        ))}
                    </select>

                    <div ref={qrRef} className="flex justify-center mb-4">
                        <QRCodeSVG value={qrUrl} size={140} />
                    </div>

                    {!normalizarUrlBase(urlClientePublica) && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && (
                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 mb-2 leading-snug">
                            ⚠️ Abre esta página desde la IP del ordenador para que el QR funcione en el móvil.<br />
                            Ej: <strong>http://192.168.X.X:5173</strong>
                        </p>
                    )}

                    <button
                        onClick={descargarQR}
                        className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700 transition mb-2 flex items-center justify-center gap-2"
                    >
                        ↓ {t("carta.descargarQR")}
                    </button>

                    <button
                        onClick={imprimirQR}
                        className="w-full bg-emerald-800 text-white py-2 rounded-lg text-sm hover:bg-emerald-900 transition mb-3 flex items-center justify-center gap-2"
                    >
                        🖨 {t("carta.imprimirCarta")}
                    </button>

                    <div className="border-t border-gray-200 pt-3 mt-1">
                        <button
                            onClick={activarCarta}
                            disabled={!cartaSeleccionadaId || carta?.activa}
                            className={`w-full py-2 rounded-lg text-sm transition mb-2 ${
                                carta?.activa
                                    ? "bg-teal-100 text-teal-700 font-semibold cursor-default"
                                    : "bg-amber-500 text-white hover:bg-amber-600"
                            }`}
                        >
                            {carta?.activa ? "✓ Carta activa en QR" : "Usar esta carta en el QR"}
                        </button>
                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                            {t("carta.textoQR")}
                        </p>
                    </div>
                </div>
            </div>

            {/* MODAL: NUEVA CARTA */}
            {modalNuevaCarta && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalNuevaCarta(false)}>
                    <div className="bg-white rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold mb-4">{t("carta.crearNuevaCarta")}</h3>
                        <input
                            autoFocus
                            type="text"
                            value={nombreNuevaCarta}
                            onChange={e => setNombreNuevaCarta(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && crearCarta()}
                            placeholder={t("carta.nombreCarta")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-emerald-500"
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setModalNuevaCarta(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">
                                {t("cancelar")}
                            </button>
                            <button onClick={crearCarta} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700">
                                {t("guardar")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: NUEVA SECCIÓN */}
            {modalNuevaSeccion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalNuevaSeccion(false)}>
                    <div className="bg-white rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold mb-4">{t("carta.añadirSeccion")}</h3>
                        <label className="block text-xs text-gray-500 mb-1">{t("config.español")}</label>
                        <input
                            autoFocus
                            type="text"
                            value={nombreNuevaSeccion}
                            onChange={e => setNombreNuevaSeccion(e.target.value)}
                            placeholder={t("carta.nombreSeccion")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-emerald-500"
                        />
                        <label className="block text-xs text-gray-500 mb-1">{t("config.ingles")}</label>
                        <input
                            type="text"
                            value={nombreEnNuevaSeccion}
                            onChange={e => setNombreEnNuevaSeccion(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && añadirSeccion()}
                            placeholder={t("carta.nombreSeccionEn")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-emerald-500"
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setModalNuevaSeccion(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">
                                {t("cancelar")}
                            </button>
                            <button onClick={añadirSeccion} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700">
                                {t("guardar")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: EDITAR SECCIÓN */}
            {modalEditarSeccion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalEditarSeccion(null)}>
                    <div className="bg-white rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold mb-4">{t("editar")} {t("carta.nombreSeccion")}</h3>
                        <label className="block text-xs text-gray-500 mb-1">{t("config.español")}</label>
                        <input
                            autoFocus
                            type="text"
                            value={modalEditarSeccion.nombre}
                            onChange={e => setModalEditarSeccion(prev => ({ ...prev, nombre: e.target.value }))}
                            placeholder={t("carta.nombreSeccion")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-amber-400"
                        />
                        <label className="block text-xs text-gray-500 mb-1">{t("config.ingles")}</label>
                        <input
                            type="text"
                            value={modalEditarSeccion.nombreEn}
                            onChange={e => setModalEditarSeccion(prev => ({ ...prev, nombreEn: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && guardarEdicionSeccion()}
                            placeholder={t("carta.nombreSeccionEn")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-amber-400"
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setModalEditarSeccion(null)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">
                                {t("cancelar")}
                            </button>
                            <button onClick={guardarEdicionSeccion} className="bg-amber-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-amber-600">
                                {t("guardar")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: AÑADIR PLATO A SECCIÓN */}
            {modalAñadir && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalAñadir(null)}>
                    <div className="bg-white rounded-xl p-6 w-96 shadow-xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold mb-3">{t("carta.seleccionarPlato")}</h3>
                        <input
                            autoFocus
                            type="text"
                            value={busquedaPlato}
                            onChange={e => setBusquedaPlato(e.target.value)}
                            placeholder={t("carta.buscar")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-emerald-500"
                        />
                        <div className="overflow-y-auto flex-1">
                            {platosDisponiblesParaSeccion(modalAñadir.seccionId)
                                .filter(p => p.nombre.toLowerCase().includes(busquedaPlato.toLowerCase()))
                                .map(plato => (
                                    <button
                                        key={plato.id}
                                        onClick={() => añadirPlatoASeccion(modalAñadir.seccionId, plato.id)}
                                        className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border-b last:border-0"
                                    >
                                        {plato.imagen && (
                                            <img src={`/uploads/FotoPlatos/${plato.imagen}`} className="w-10 h-10 rounded object-cover" />
                                        )}
                                        <div>
                                            <div className="text-sm font-medium">{idioma === "en" && plato.nombreEn ? plato.nombreEn : plato.nombre}</div>
                                            <div className="text-xs text-gray-500">{plato.precio} €</div>
                                        </div>
                                    </button>
                                ))}
                        </div>
                        <button onClick={() => setModalAñadir(null)} className="mt-3 text-sm text-gray-500 hover:text-gray-700 self-end px-3 py-1.5">
                            {t("cancelar")}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: CONFIRMAR ELIMINAR CARTA */}
            {confirmarEliminarCarta && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setConfirmarEliminarCarta(false)}>
                    <div className="bg-white rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold text-red-700 mb-2">{t("carta.eliminarCarta")}</h3>
                        <p className="text-sm text-gray-600 mb-5">
                            {t("carta.confirmarEliminar")} <strong>"{carta?.nombre}"</strong>.
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmarEliminarCarta(false)}
                                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">
                                {t("cancelar")}
                            </button>
                            <button onClick={eliminarCarta}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition">
                                {t("carta.eliminar")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CartaEditor;
