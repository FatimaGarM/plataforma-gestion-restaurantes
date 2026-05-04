import { useState, useEffect } from "react";
import {
    Smartphone, UtensilsCrossed, ClipboardList, Clock, ChefHat,
    CheckCircle2, ConciergeBell, Users, CreditCard, Banknote,
    ShoppingCart, ArrowLeft, X, Plus, Minus, ChevronUp, ChevronDown,
    AlertTriangle, Loader2
} from "lucide-react";

const DURACION_COOKIE_HORAS = 4;
const POLL_MS = 15000;
const PERSONA_COLORES = ["#0d9488", "#7c3aed", "#dc2626", "#d97706", "#2563eb", "#db2777", "#0891b2", "#65a30d"];

function getCookie(nombre) {
    const match = document.cookie.split("; ").find(r => r.startsWith(nombre + "="));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function setCookie(nombre, valor, horas) {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + horas * 60 * 60 * 1000);
    document.cookie = `${nombre}=${encodeURIComponent(valor)};expires=${fecha.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(nombre) {
    document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

function tiempoDesc(fechaStr, lang = "es") {
    if (!fechaStr) return "";
    const ms = Date.now() - new Date(fechaStr).getTime();
    const m = Math.floor(ms / 60000);
    if (lang === "en") {
        if (m < 1) return "just now";
        if (m === 1) return "1 min ago";
        if (m < 60) return `${m} min ago`;
        const h = Math.floor(m / 60);
        return `${h}h ${m % 60}min ago`;
    }
    if (m < 1) return "ahora mismo";
    if (m === 1) return "hace 1 min";
    if (m < 60) return `hace ${m} min`;
    const h = Math.floor(m / 60);
    return `hace ${h}h ${m % 60}min`;
}

function estadoInfo(estado, lang = "es") {
    const en = lang === "en";
    switch (estado) {
        case "Pendiente": return { icono: <Clock size={18} />, color: "bg-yellow-100 text-yellow-700", texto: en ? "Pending" : "Pendiente" };
        case "En proceso": return { icono: <ChefHat size={18} />, color: "bg-blue-100 text-blue-700", texto: en ? "Preparing" : "En preparacion" };
        case "Listo": return { icono: <CheckCircle2 size={18} />, color: "bg-green-100 text-green-700", texto: en ? "Ready!" : "Listo!" };
        case "Servido": return { icono: <ConciergeBell size={18} />, color: "bg-gray-100 text-gray-500", texto: en ? "Served" : "Servido" };
        default: return { icono: null, color: "bg-gray-100 text-gray-500", texto: estado };
    }
}

export default function CartaCamarero() {
    const mesa = parseInt(new URLSearchParams(window.location.search).get("mesa") || "0", 10);

    /* sesion y datos */
    const [token, setToken] = useState(null);
    const [carta, setCarta] = useState(null);
    const [config, setConfig] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [errorGlobal, setErrorGlobal] = useState(null);
    const [mesaCerrada, setMesaCerrada] = useState(false);

    /* navegacion: bienvenida | carta | pedidos */
    const [vista, setVista] = useState("bienvenida");
    const [seccionesAbiertas, setSeccionesAbiertas] = useState({});

    /* carrito: [{plato, persona}] â€” persona 1..nPersonas */
    const [carrito, setCarrito] = useState([]);

    /* checkout modal */
    const [checkout, setCheckout] = useState(false);
    const [nPersonas, setNPersonas] = useState(1);
    const [enviando, setEnviando] = useState(false);

    /* mis pedidos */
    const [misPedidos, setMisPedidos] = useState([]);
    const [listosBadge, setListosBadge] = useState(0);
    const [resumenMesa, setResumenMesa] = useState(null);
    const [solicitandoCobro, setSolicitandoCobro] = useState(false);
    const [descargandoTicket, setDescargandoTicket] = useState(false);

    /* idioma carta */
    const [idioma, setIdioma] = useState("es");

    /* toast */
    const [toast, setToast] = useState(null); // {msg, tipo}
    const [requiereCodigo, setRequiereCodigo] = useState(false);
    const [codigoInput, setCodigoInput] = useState("");
    const [errorCodigo, setErrorCodigo] = useState("");
    const [codigoMesaActual, setCodigoMesaActual] = useState("");
    const [modoMesa, setModoMesa] = useState(null);
    const [personaId, setPersonaId] = useState(null);
    const keySesion = `sesion_mesa_${mesa}`;
    const keyCodigo = `codigo_mesa_${mesa}`;
    const keyPersona = `persona_mesa_${mesa}`;

    async function solicitarSesion(numeroMesa, codigo = "") {
        const qsCodigo = codigo ? `&codigo=${encodeURIComponent(codigo)}` : "";
        try {
            const r = await fetch(`/publica/sesion?mesa=${numeroMesa}${qsCodigo}`);
            if (!r.ok) {
                const d = await r.json().catch(() => ({}));
                return { ok: false, error: d.error || "ERROR_SESION" };
            }
            const d = await r.json();
            return { ok: true, data: d };
        } catch {
            return { ok: false, error: "ERROR_CONEXION" };
        }
    }

    function limpiarDatosLocalesMesa() {
        deleteCookie(keySesion);
        localStorage.removeItem(keyCodigo);
        localStorage.removeItem(keyPersona);
        setCodigoMesaActual("");
        setPersonaId(null);
    }

    async function cargarResumen(tokenSesion, personaActual = personaId) {
        const qsPersona = personaActual ? `&persona=${encodeURIComponent(personaActual)}` : "";
        const res = await fetch(`/publica/resumen?token=${encodeURIComponent(tokenSesion)}${qsPersona}`);
        if (res.status === 401) {
            throw new Error("TOKEN_INVALIDO");
        }
        const data = res.ok ? await res.json() : null;
        setResumenMesa(data);
        setMisPedidos(Array.isArray(data?.pedidos) ? data.pedidos : []);
        setListosBadge(Array.isArray(data?.pedidos) ? data.pedidos.filter(p => p.estado === "Listo").length : 0);
        return data;
    }

    async function prepararSesionActiva(data, opciones = {}) {
        const { asignarPersonaGrupo = false } = opciones;

        setCookie(keySesion, data.token, DURACION_COOKIE_HORAS);
        setRequiereCodigo(false);
        setErrorCodigo("");
        setMesaCerrada(false);
        setErrorGlobal(null);
        setToken(data.token);

        if (data.codigoAcceso) {
            setCodigoMesaActual(data.codigoAcceso);
            localStorage.setItem(keyCodigo, data.codigoAcceso);
        }
        localStorage.removeItem(keyPersona);
        setPersonaId(null);
    }

    async function iniciar(tokenSesion) {
        try {
            const [cr, cfr, rc] = await Promise.all([
                fetch("/publica/carta"),
                fetch("/publica/configuracion"),
                fetch(`/publica/codigo?token=${encodeURIComponent(tokenSesion)}`)
            ]);

            if (cr.ok) {
                const c = await cr.json();
                setCarta(c);
                const ab = {};
                (c.secciones || []).forEach(s => { ab[s.id] = true; });
                setSeccionesAbiertas(ab);
            }

            if (cfr.ok) {
                setConfig(await cfr.json());
            }

            if (rc.ok) {
                const dc = await rc.json();
                if (dc?.codigoAcceso) {
                    setCodigoMesaActual(dc.codigoAcceso);
                    localStorage.setItem(keyCodigo, dc.codigoAcceso);
                }
                if (dc?.modo) {
                    setModoMesa(dc.modo);
                }
            }

            setMesaCerrada(false);
            setVista("bienvenida");
            setToken(tokenSesion);
            await cargarResumen(tokenSesion, localStorage.getItem(keyPersona));
        } catch {
            setErrorGlobal("No se pudo conectar con el restaurante.");
        } finally {
            setCargando(false);
        }
    }

    // Inicializar sesion al montar
    useEffect(() => {
        const cargarConfiguracion = async () => {
            if (!mesa) {
                setCargando(false);
                const cfr = await fetch("/publica/configuracion");
                if (cfr.ok) {
                    setConfig(await cfr.json());
                }
                return;
            }
        };
        setVista("bienvenida");
        const saved = getCookie(keySesion);

        (async () => {
            const codigoGuardado = localStorage.getItem(keyCodigo) || "";
            if (codigoGuardado) setCodigoMesaActual(codigoGuardado);

            if (!saved) {
                localStorage.removeItem(keyCodigo);
                localStorage.removeItem(keyPersona);
                setCodigoMesaActual("");
                setPersonaId(null);
            }

            if (saved) {
                try {
                    await cargarResumen(saved, localStorage.getItem(keyPersona));
                    if (localStorage.getItem(keyPersona)) {
                        setPersonaId(localStorage.getItem(keyPersona));
                    }
                    await iniciar(saved);
                    return;
                } catch {
                    limpiarDatosLocalesMesa();
                }
            }
            if (mesa !== 0) {
                const resp = await solicitarSesion(mesa);

                if (!resp.ok) {
                    if (resp.error === "MODO_INDIVIDUAL") {
                        setErrorGlobal("Esta mesa está en modo individual y ya está ocupada por otra persona. No puedes unirte.");
                        setCargando(false);
                        return;
                    }
                    if (resp.error === "CODIGO_REQUERIDO" || resp.error === "CODIGO_INVALIDO") {
                        setRequiereCodigo(true);
                        setErrorCodigo(resp.error === "CODIGO_INVALIDO"
                            ? "Codigo incorrecto. Intentalo de nuevo."
                            : "Introduce el codigo de mesa para unirte.");
                        setCargando(false);
                        return;
                    }
                    setErrorGlobal("No se pudo iniciar la sesion.");
                    setCargando(false);
                    return;
                }
                await prepararSesionActiva(resp.data);
                await iniciar(resp.data.token);
            } else {
                setModoMesa("PENDIENTE");
                setCargando(false);
            }
        })();
    }, [mesa]);

    // Poll mis pedidos cada 5s
    useEffect(() => {
        if (!token) return;
        function poll() {
            cargarResumen(token, personaId)
                .catch(async (e) => {
                    if (e?.message !== "TOKEN_INVALIDO") return;
                    limpiarDatosLocalesMesa();
                    const resp = await solicitarSesion(mesa);
                    if (!resp.ok) {
                        if (resp.error === "CODIGO_REQUERIDO" || resp.error === "CODIGO_INVALIDO") {
                            setRequiereCodigo(true);
                            setErrorCodigo("Introduce el codigo de mesa para unirte.");
                            setToken(null);
                            return;
                        }
                        setMesaCerrada(true);
                        setToken(null);
                        return;
                    }
                    await prepararSesionActiva(resp.data);
                    await iniciar(resp.data.token);
                });
        }
        poll();
        const id = setInterval(poll, POLL_MS);
        return () => clearInterval(id);
    }, [token, mesa, personaId]);

    // Reclampar personas al bajar nPersonas
    useEffect(() => {
        setCarrito(prev => prev.map(item => ({
            ...item, persona: Math.min(item.persona, nPersonas)
        })));
    }, [nPersonas]);

    function mostrarToast(msg, tipo = "ok") {
        setToast({ msg, tipo });
        setTimeout(() => setToast(null), 4000);
    }

    function anadir(plato) { setCarrito(prev => [...prev, { plato, persona: 1 }]); }
    function quitar(i) { setCarrito(prev => prev.filter((_, idx) => idx !== i)); }

    async function confirmarPedido() {
        if (!carrito.length || !token) return;
        setEnviando(true);
        try {
            const res = await fetch("/publica/pedidos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    items: carrito.map(i => ({
                        platoId: i.plato.id,
                        persona: i.persona
                    }))
                }),
            });
            if (res.ok) {
                setCarrito([]);
                setCheckout(false);
                setNPersonas(1);
                await cargarResumen(token, personaId);
                mostrarToast(idioma === "en" ? "Order sent! It's in the kitchen." : "Pedido enviado. Ya esta en cocina.", "ok");
            } else {
                if (res.status === 401) {
                    limpiarDatosLocalesMesa();
                    setMesaCerrada(true);
                    setToken(null);
                    mostrarToast("La mesa fue cerrada. Escanea el QR para iniciar nueva sesion.", "error");
                    return;
                }
                const d = await res.json().catch(() => ({}));
                mostrarToast(d.error || "Error al enviar.", "error");
            }
        } catch { mostrarToast("Error de conexion.", "error"); }
        finally { setEnviando(false); }
    }

    const primary = config?.colorPrimario || "#0d9488";
    const secondary = config?.colorSecundario || "#134e4a";
    const nombreRestaurante = config?.nombreRestaurante || "Restaurante";
    const totalCarrito = carrito.reduce((s, i) => s + Number(i.plato.precio), 0);
    const idiomasDisponibles = (config?.idiomaCarta || "es").split(",").map(s => s.trim()).filter(Boolean);
    const mostrarSelectorIdioma = idiomasDisponibles.length > 1;

    function nombrePlato(plato) { return (idioma === "en" && plato.nombreEn) || plato.nombre; }
    function descPlato(plato) { return (idioma === "en" && plato.descripcionEn) || plato.descripcion; }
    function nombreSeccion(sec) { return (idioma === "en" && sec.nombreEn) || sec.nombre; }

    /* â”€â”€ CARGANDO â”€â”€ */
    if (cargando) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-sm animate-pulse">Cargando...</p>
        </div>
    );

    /* â”€â”€ SIN MESA â”€â”€ */
    if (!mesa) return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">

            {/* Fondo */}
            {config?.imagenFondo
                ? <img src={`/uploads/Configuracion/${config.imagenFondo}`} className="absolute inset-0 w-full h-full object-cover" />
                : <div className="absolute inset-0" style={{ backgroundColor: secondary }} />
            }

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-700/50 to-orange-600/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />

            <div className="flex justify-between">
                <div className=" z-10 flex items-center gap-2 px-5 pt-5">
                    <button onClick={() => window.location.href = `/inicio`} className="text-white hover:text-gray-300 text-xs flex items-center gap-1 mb-0.5 transition">
                        <ArrowLeft size={12} /> {idioma === "en" ? "Back to index" : "Volver a inicio"}
                    </button>
                </div>

                {/* Idioma */}
                {mostrarSelectorIdioma && (
                    <div className="relative z-10 flex justify-end gap-2 px-5 pt-5">
                        {idiomasDisponibles.map(lang => (
                            <button key={lang} onClick={() => setIdioma(lang)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${idioma === lang
                                    ? "bg-white text-gray-800"
                                    : "bg-white/20 text-white/70 hover:bg-white/30"
                                    }`}>
                                {lang === "es" ? "ES" : "EN"}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* CONTENIDO COMPLETO */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-white text-center">
                {/* Logo */}
                {config?.logo && (
                    <img src={`/uploads/Configuracion/${config.logo}`}
                        className="w-28 h-28 rounded-full object-cover mb-5 shadow-2xl border-4 border-white/30"
                    />
                )}
                <h1 className="text-3xl font-bold mb-1 drop-shadow-lg">{nombreRestaurante}</h1>

                <p className="text-gray-200 text-sm mb-4">
                    {idioma === "en"
                        ? "Welcome! Please select a table to start ordering."
                        : "¡Bienvenido! Selecciona una mesa y haz un pedido."
                    }
                </p>

                {/* SELECT */}
                <select
                    onChange={(e) => window.location.href = `/carta?mesa=${e.target.value}`}
                    className="p-3 border border-gray-300 rounded-lg mb-3 text-black"
                >
                    <option value="">{idioma === "en" ? "Select Table" : "Seleccionar Mesa"}</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
                        <option key={m} value={m}>
                            {idioma === "en" ? "Table" : "Mesa"} {m}
                        </option>
                    ))}
                </select>
            </div>
        </div >
    );

    /* â”€â”€ ERROR GLOBAL â”€â”€ */
    if (errorGlobal) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <div className="mb-4 text-amber-500"><AlertTriangle size={48} /></div>
            <p className="text-gray-700">{errorGlobal}</p>
        </div>
    );

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       VISTA: BIENVENIDA
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    async function establecerModo() {
        setCargando(true);
        try {
            const res = await fetch("/publica/sesion/modo", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, modo: "INDIVIDUAL" })
            });
            if (res.ok) {
                localStorage.removeItem(keyPersona);
                setPersonaId(null);

                const data = await res.json().catch(() => ({}));
                setModoMesa(data?.modo || "INDIVIDUAL");
            }
        } catch { }
        setCargando(false);
    }
    if (vista === "bienvenida" && modoMesa === "PENDIENTE") return (
        establecerModo()
    );

    if (vista === "bienvenida") return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Fondo: imagen del restaurante o color secundario */}
            {config?.imagenFondo
                ? <img src={`/uploads/Configuracion/${config.imagenFondo}`} className="absolute inset-0 w-full h-full object-cover" alt="fondo" />
                : <div className="absolute inset-0" style={{ backgroundColor: secondary }} />
            }
            {/* Overlay ambar calido igual que Login */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-700/50 to-orange-600/40" />
            {/* Mas oscuro abajo igual que Login */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />

            <div className="flex justify-between">
                <div className="z-10 flex items-center gap-4 px-5 pt-5">
                    <button onClick={() => window.location.href = `/carta`} className="text-white hover:text-gray-300 text-xs flex items-center gap-1 mb-0.5 transition">
                        <ArrowLeft size={12} /> {idioma === "en" ? "Select table" : "Seleccionar mesa"}
                    </button>
                </div>

                {/* Selector de idioma arriba a la derecha */}
                {mostrarSelectorIdioma && (
                    <div className="z-10 flex justify-end gap-2 px-5 pt-5">
                        {idiomasDisponibles.map(lang => (
                            <button key={lang} onClick={() => setIdioma(lang)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${idioma === lang
                                    ? "bg-white text-gray-800"
                                    : "bg-white/20 text-white/70 hover:bg-white/30"
                                    }`}>
                                {lang === "es" ? "ES" : "EN"}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-white text-center">
                {config?.logo && (
                    <img src={`/uploads/Configuracion/${config.logo}`}
                        className="w-28 h-28 rounded-full object-cover mb-5 shadow-2xl border-4 border-white/30"
                        alt="logo" />
                )}
                <h1 className="text-3xl font-bold mb-1 drop-shadow-lg">{nombreRestaurante}</h1>
                <p className="text-white/60 text-sm mb-10">{idioma === "en" ? "Table" : "Mesa"} {mesa}</p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button onClick={() => setVista("carta")}
                        className="py-4 rounded-2xl font-semibold text-base shadow-xl transition active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm"
                        style={{ backgroundColor: primary, color: "#fff" }}>
                        <UtensilsCrossed size={20} />
                        {idioma === "en" ? "View menu" : "Ver la carta"}
                    </button>

                    <button disabled
                        className="py-4 rounded-2xl font-semibold text-base bg-white/15 text-white/50 cursor-not-allowed flex flex-col items-center backdrop-blur-sm border border-white/10">
                        <span className="flex items-center gap-2"><ClipboardList size={20} />
                            {idioma === "en" ? "Daily menu" : "Menu del dia"}
                        </span>
                        <span className="block text-xs font-normal mt-0.5 opacity-60">
                            {idioma === "en" ? "Coming soon" : "Proximamente"}
                        </span>
                    </button>
                </div>

                {listosBadge > 0 && (
                    <button onClick={() => setVista("pedidos")}
                        className="mt-8 flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-semibold animate-bounce shadow-lg">
                        <CheckCircle2 size={18} /> {listosBadge} {listosBadge === 1
                            ? (idioma === "en" ? "dish ready" : "plato listo")
                            : (idioma === "en" ? "dishes ready" : "platos listos")}
                    </button>
                )}
            </div>

            {misPedidos.length > 0 && (
                <div className="relative z-10 flex justify-center pb-8">
                    <button onClick={() => setVista("pedidos")} className="text-white/50 text-sm underline">
                        {idioma === "en" ? `View my orders (${misPedidos.length})` : `Ver mis pedidos (${misPedidos.length})`}
                    </button>
                </div>
            )}
        </div>
    );

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       VISTA: MIS PEDIDOS
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    if (vista === "pedidos") return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <button onClick={() => setVista("carta")} className="text-gray-500 hover:text-gray-800 transition">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <p className="text-xs text-gray-400">{idioma === "en" ? "Table" : "Mesa"} {mesa}</p>
                    <h1 className="font-semibold text-sm text-gray-800">
                        {idioma === "en" ? "Orders" : "Pedidos"}
                    </h1>
                </div>
                {mostrarSelectorIdioma && (
                    <div className="flex gap-1">
                        {idiomasDisponibles.map(lang => (
                            <button key={lang} onClick={() => setIdioma(lang)}
                                className={`px-2 py-1 rounded text-xs font-semibold transition ${idioma === lang ? "text-white" : "bg-gray-100 text-gray-500"
                                    }`}
                                style={idioma === lang ? { backgroundColor: primary } : {}}>
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="max-w-lg mx-auto px-3 py-4 space-y-4">
                {resumenMesa && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400">{idioma === "en" ? "Total table" : "Total mesa"}</p>
                            <p className="text-xl font-bold text-gray-800 mt-1">
                                {Number(resumenMesa.totalMesa || 0).toFixed(2)} €
                            </p>
                        </div>
                    </div>
                )}

                {misPedidos.length === 0 ? (
                    <div className="text-center text-gray-400 py-16">
                        <div className="mb-3 flex justify-center text-gray-300"><ShoppingCart size={48} /></div>
                        <p>{idioma === "en" ? "No orders yet." : "Aun no has hecho ningun pedido."}</p>
                        <button onClick={() => setVista("carta")} className="mt-4 text-sm font-medium text-amber-600 hover:text-amber-700 underline">
                            {idioma === "en" ? "Go to menu" : "Ir a la carta"}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {misPedidos.map(p => {
                            const info = estadoInfo(p.estado, idioma);
                            const personaPedido = p.persona || 1;
                            return (
                                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 px-4 py-3">
                                    <span className={`p-1.5 rounded-lg ${info.color}`}>{info.icono}</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-800">
                                            {p.plato?.nombre}
                                            <span className="ml-2 text-xs text-amber-600 font-bold">P{personaPedido}</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{tiempoDesc(p.fechaHora, idioma)}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${info.color}`}>
                                        {info.texto}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       VISTA: CARTA
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Cabecera */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div>
                    <button onClick={() => setVista("bienvenida")} className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1 mb-0.5 transition">
                        <ArrowLeft size={12} /> {idioma === "en" ? "Home" : "Inicio"}
                    </button>
                    <h1 className="font-semibold text-sm text-gray-800">{nombreRestaurante} · {idioma === "en" ? "Table" : "Mesa"} {mesa}</h1>
                </div>
                <button onClick={() => setVista("pedidos")}
                    className="relative flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 transition">
                    <ClipboardList size={14} /> {idioma === "en" ? "Orders" : "Pedidos"}
                    {listosBadge > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {listosBadge}
                        </span>
                    )}
                </button>
            </div>

            {/* Selector de idioma */}
            {mostrarSelectorIdioma && (
                <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2">
                    {idiomasDisponibles.map(lang => (
                        <button key={lang} onClick={() => setIdioma(lang)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${idioma === lang ? "text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                            style={idioma === lang ? { backgroundColor: primary } : {}}>
                            {lang === "es" ? "ES • Espanol" : "EN • English"}
                        </button>
                    ))}
                </div>
            )}

            {/* Banner */}
            {carta?.imagenBanner && (
                <div className="h-36 overflow-hidden">
                    <img src={`/uploads/Cartas/${carta.imagenBanner}`} className="w-full h-full object-cover" alt="banner" />
                </div>
            )}

            {!carta && <div className="p-8 text-center text-gray-500">{idioma === "en" ? "Menu not available." : "La carta no esta disponible."}</div>}

            {/* Secciones */}
            {carta && (
                <div className="max-w-lg mx-auto px-3 py-4 pb-44">
                    {(carta.secciones || []).map(seccion => (
                        <div key={seccion.id} className="mb-4">
                            <button
                                onClick={() => setSeccionesAbiertas(prev => ({ ...prev, [seccion.id]: !prev[seccion.id] }))}
                                className="w-full text-left px-4 py-2 rounded-xl font-semibold text-sm flex justify-between items-center transition"
                                style={{ backgroundColor: primary, color: "#fff" }}>
                                <span>{nombreSeccion(seccion)}</span>
                                {seccionesAbiertas[seccion.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {seccionesAbiertas[seccion.id] && (
                                <div className="mt-1 space-y-2">
                                    {(seccion.items || []).map(item => {
                                        const plato = item.plato;
                                        if (!plato?.disponible) return null;
                                        return (
                                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 px-3 py-2 hover:shadow-md transition">
                                                {plato.imagen && (
                                                    <img src={`/uploads/FotoPlatos/${plato.imagen}`}
                                                        className="w-16 h-16 rounded-lg object-cover shrink-0" alt={plato.nombre} />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-gray-800 truncate">{nombrePlato(plato)}</p>
                                                    {descPlato(plato) && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{descPlato(plato)}</p>}
                                                    <p className="text-sm font-bold mt-1" style={{ color: primary }}>{Number(plato.precio).toFixed(2)} €</p>
                                                </div>
                                                <button onClick={() => anadir(plato)}
                                                    className="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center transition active:scale-95"
                                                    style={{ backgroundColor: primary }}>
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Carrito flotante */}
            {carrito.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl px-4 py-3 z-40">
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-600">{carrito.length} {carrito.length === 1 ? (idioma === "en" ? "dish" : "plato") : (idioma === "en" ? "dishes" : "platos")}</p>
                            <p className="text-sm font-bold" style={{ color: primary }}>{totalCarrito.toFixed(2)} €</p>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3 max-h-16 overflow-y-auto">
                            {carrito.map((item, i) => (
                                <span key={i} onClick={() => quitar(i)}
                                    className="text-xs bg-gray-100 rounded-full px-3 py-1 cursor-pointer hover:bg-red-100 hover:text-red-600 transition flex items-center gap-1">
                                    {item.plato.nombre} <X size={10} />
                                </span>
                            ))}
                        </div>
                        <button onClick={() => setCheckout(true)}
                            className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition flex items-center justify-center gap-2"
                            style={{ backgroundColor: secondary }}>
                            <ShoppingCart size={16} /> {idioma === "en" ? "Review & order" : "Revisar y pedir"}
                        </button>
                    </div>
                </div>
            )}

            {/* â•â•â• MODAL CHECKOUT â•â•â• */}
            {checkout && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
                    <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto">

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10">
                            <h2 className="font-bold text-gray-800 text-base">{idioma === "en" ? "Confirm order" : "Confirmar pedido"}</h2>
                            <button onClick={() => setCheckout(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
                        </div>

                        <div className="px-5 py-4 space-y-6">

                            {/* Items con asignacion de persona */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <UtensilsCrossed size={16} /> {idioma === "en" ? "Order" : "Pedido"}
                                </p>
                                <div className="space-y-2">
                                    {carrito.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">{item.plato.nombre}</p>
                                                <p className="text-xs text-gray-500">{Number(item.plato.precio).toFixed(2)} €</p>
                                            </div>
                                            <button onClick={() => quitar(i)} className="text-gray-300 hover:text-red-400 transition"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center border-t pt-4">
                                <p className="font-semibold text-gray-700">{idioma === "en" ? "Total" : "Total"}</p>
                                <p className="text-xl font-bold" style={{ color: primary }}>{totalCarrito.toFixed(2)} €</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-6 pt-3 border-t sticky bottom-0 bg-white">
                            <button onClick={confirmarPedido} disabled={enviando || carrito.length === 0}
                                className={`w-full py-3 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2 ${enviando || carrito.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}>
                                {enviando ? <><Loader2 size={16} className="animate-spin" /> {idioma === "en" ? "Sending..." : "Enviando..."}</> : (idioma === "en" ? `Send order · ${totalCarrito.toFixed(2)} €` : `Enviar pedido · ${totalCarrito.toFixed(2)} €`)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 text-white text-sm px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${toast.tipo === "ok" ? "bg-emerald-600" : "bg-red-600"
                    }`}>
                    {toast.tipo === "ok" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
}


