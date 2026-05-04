import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import {
    Smartphone, UtensilsCrossed, ClipboardList, Clock, ChefHat,
    CheckCircle2, ConciergeBell, Users, CreditCard, Banknote,
    ShoppingCart, ArrowLeft, X, Plus, Minus, ChevronUp, ChevronDown,
    AlertTriangle, Loader2
} from "lucide-react";

const DURACION_COOKIE_HORAS = 4;
const POLL_MS = 15000;
const PERSONA_COLORES = ["#0d9488","#7c3aed","#dc2626","#d97706","#2563eb","#db2777","#0891b2","#65a30d"];

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
        case "Pendiente":  return { icono: <Clock        size={18} />, color: "bg-yellow-100 text-yellow-700", texto: en ? "Pending"     : "Pendiente" };
        case "En proceso": return { icono: <ChefHat      size={18} />, color: "bg-blue-100 text-blue-700",    texto: en ? "Preparing"   : "En preparacion" };
        case "Listo":      return { icono: <CheckCircle2 size={18} />, color: "bg-green-100 text-green-700",  texto: en ? "Ready!"      : "Listo!" };
        case "Servido":    return { icono: <ConciergeBell size={18} />, color: "bg-gray-100 text-gray-500",  texto: en ? "Served"      : "Servido" };
        default:           return { icono: null, color: "bg-gray-100 text-gray-500", texto: estado };
    }
}

export default function CartaCliente() {
    const mesa = parseInt(new URLSearchParams(window.location.search).get("mesa") || "0", 10);

    /* sesion y datos */
    const [token,       setToken]      = useState(null);
    const [carta,       setCarta]      = useState(null);
    const [config,      setConfig]     = useState(null);
    const [cargando,    setCargando]   = useState(true);
    const [errorGlobal, setErrorGlobal] = useState(null);
    const [mesaCerrada, setMesaCerrada] = useState(false);

    /* navegacion: bienvenida | carta | pedidos */
    const [vista, setVista] = useState("bienvenida");
    const [seccionesAbiertas, setSeccionesAbiertas] = useState({});

    /* carrito: [{plato, persona}] â€” persona 1..nPersonas */
    const [carrito,    setCarrito]   = useState([]);

    /* checkout modal */
    const [checkout,   setCheckout]   = useState(false);
    const [nPersonas,  setNPersonas]  = useState(1);
    const [metodoPago, setMetodoPago] = useState("metalico");
    const [enviando,   setEnviando]   = useState(false);

    /* mis pedidos */
    const [misPedidos,  setMisPedidos]  = useState([]);
    const [listosBadge, setListosBadge] = useState(0);
    const [resumenMesa, setResumenMesa] = useState(null);
    const [solicitandoCobro, setSolicitandoCobro] = useState(false);
    const [descargandoTicket, setDescargandoTicket] = useState(false);

    /* menu del dia */
    const [menuHoy, setMenuHoy] = useState(null);

    /* menu del dia - seleccion por categoria */
    const [seleccionMenu, setSeleccionMenu] = useState({});

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
    const [comensalesMap, setComensalesMap] = useState({});
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
        setComensalesMap({});
    }

    async function solicitarNuevaPersona(tokenSesion) {
        const pr = await fetch("/publica/sesion/nueva-persona", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenSesion })
        });
        if (!pr.ok) return null;
        const pd = await pr.json().catch(() => ({}));
        return pd?.personaId ? String(pd.personaId) : null;
    }

    async function obtenerOCrearComensal(tokenSesion, numero) {
        try {
            const res = await fetch("/publica/comensales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: tokenSesion, numero })
            });
            if (!res.ok) return null;
            const d = await res.json();
            return d.id || null;
        } catch { return null; }
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

    async function solicitarCobroMesa() {
        if (!token) return;
        setSolicitandoCobro(true);
        try {
            const res = await fetch("/publica/cobro/solicitar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    metodoPago,
                    persona: personaId
                })
            });
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                throw new Error(d.error || `Error ${res.status}`);
            }
            await cargarResumen(token, personaId);
            mostrarToast(idioma === "en" ? "Payment requested." : "Cobro solicitado al camarero.", "ok");
        } catch (e) {
            mostrarToast(e?.message || "Error al solicitar cobro.", "error");
        } finally {
            setSolicitandoCobro(false);
        }
    }

    async function descargarTicket() {
        if (!token) return;
        setDescargandoTicket(true);
        try {
            const qsPersona = personaId ? `&persona=${encodeURIComponent(personaId)}` : "";
            const res = await fetch(`/publica/resumen?token=${encodeURIComponent(token)}${qsPersona}`);
            if (!res.ok) throw new Error("No se pudo obtener los datos del ticket.");
            const datos = await res.json();

            const nombre = config?.nombreRestaurante || "Restaurante";
            const metodo = datos.metodoPagoSolicitado || "Sin solicitar";
            const ahora = new Date();
            const fecha = ahora.toLocaleDateString("es-ES") + "  " + ahora.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

            const doc = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });
            const PW = 148, M = 14, CW = PW - 2 * M;
            let y = 16;

            const linea = (yy, dashed = false) => {
                doc.setLineWidth(dashed ? 0.2 : 0.4);
                if (dashed) doc.setLineDashPattern([1.5, 1], 0);
                doc.line(M, yy, PW - M, yy);
                if (dashed) doc.setLineDashPattern([], 0);
            };

            // Cabecera
            doc.setFont("helvetica", "bold"); doc.setFontSize(18);
            doc.text(nombre, PW / 2, y, { align: "center" }); y += 6;
            doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(90);
            doc.text(`Mesa ${mesa}   |   ${fecha}   |   Pago: ${metodo}`, PW / 2, y, { align: "center" });
            doc.setTextColor(0); y += 5;
            linea(y); y += 7;

            // Personas
            for (const grupo of (datos.totalesPorPersona || [])) {
                doc.setFillColor(235, 235, 235);
                doc.rect(M, y - 4, CW, 6.5, "F");
                doc.setFont("helvetica", "bold"); doc.setFontSize(10);
                doc.text(`Persona ${grupo.persona}${grupo.cobrado ? "  (Cobrado)" : ""}`, M + 2, y);
                y += 6;

                const items = grupo.items || [];
                if (items.length === 0) {
                    doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(150);
                    doc.text("Sin pedidos", M + 2, y); doc.setTextColor(0); y += 5;
                } else {
                    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
                    for (const item of items) {
                        const etiqueta = item.esMenu ? "[M] " : "[C] ";
                        doc.text(etiqueta + item.nombre, M + 2, y);
                        doc.text(parseFloat(item.precio || 0).toFixed(2) + " EUR", PW - M, y, { align: "right" });
                        y += 5;
                    }
                    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(80);
                    doc.text("Subtotal:", M + 2, y);
                    doc.text(parseFloat(grupo.total || 0).toFixed(2) + " EUR", PW - M, y, { align: "right" });
                    doc.setTextColor(0); y += 4;
                }
                linea(y, true); y += 6;
            }

            // Total
            linea(y); y += 6;
            if (datos.personaActual != null) {
                doc.setFont("helvetica", "normal"); doc.setFontSize(10);
                doc.text("Total mesa:", M + 2, y);
                doc.text(parseFloat(datos.totalMesa || 0).toFixed(2) + " EUR", PW - M, y, { align: "right" });
                y += 7;
                doc.setFont("helvetica", "bold"); doc.setFontSize(14);
                doc.text("Tu parte:", M + 2, y);
                doc.text(parseFloat(datos.subtotalPersonaActual || 0).toFixed(2) + " EUR", PW - M, y, { align: "right" });
            } else {
                doc.setFont("helvetica", "bold"); doc.setFontSize(14);
                doc.text("TOTAL:", M + 2, y);
                doc.text(parseFloat(datos.totalMesa || 0).toFixed(2) + " EUR", PW - M, y, { align: "right" });
            }

            // Pie
            y += 10;
            doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(150);
            doc.text("Resumen no fiscal  -  Generado por la app", PW / 2, y, { align: "center" });

            doc.save(`ticket-mesa-${mesa}.pdf`);
        } catch (e) {
            mostrarToast(e?.message || "No se pudo descargar el ticket.", "error");
        } finally {
            setDescargandoTicket(false);
        }
    }

    function etiquetaMetodoPago(valor) {
        switch ((valor || "").toUpperCase()) {
            case "METALICO": return idioma === "en" ? "Cash" : "Metalico";
            case "TARJETA": return idioma === "en" ? "Card" : "Tarjeta";
            case "BIZUM": return "Bizum";
            default: return idioma === "en" ? "Not requested" : "Sin solicitar";
        }
    }

    function etiquetaEstadoCobro(valor) {
        switch (valor) {
            case "PENDIENTE_COBRO": return idioma === "en" ? "Waiting for waiter" : "Pendiente de cobro";
            case "COBRANDO": return idioma === "en" ? "Waiter on the way" : "Camarero atendiendo";
            case "COBRADO_PARCIAL": return idioma === "en" ? "Partially paid" : "Cobrado parcial";
            case "COBRADO_TOTAL": return idioma === "en" ? "Paid" : "Cobrado";
            default: return idioma === "en" ? "No payment requested" : "Sin solicitud de cobro";
        }
    }

    async function prepararSesionActiva(data, opciones = {}) {
        const { asignarPersonaGrupo = false } = opciones;
        setComensalesMap({});
        setCookie(keySesion, data.token, DURACION_COOKIE_HORAS);
        setRequiereCodigo(false);
        setErrorCodigo("");
        setMesaCerrada(false);
        setErrorGlobal(null);
        setToken(data.token);
        setModoMesa(data.modo || null);

        if (data.codigoAcceso) {
            setCodigoMesaActual(data.codigoAcceso);
            localStorage.setItem(keyCodigo, data.codigoAcceso);
        }

        if (data.modo === "GRUPO") {
            let personaGuardada = localStorage.getItem(keyPersona);
            if (asignarPersonaGrupo && !personaGuardada) {
                personaGuardada = await solicitarNuevaPersona(data.token);
            }
            setPersonaId(personaGuardada || null);
            if (personaGuardada) {
                localStorage.setItem(keyPersona, personaGuardada);
            }
        } else {
            localStorage.removeItem(keyPersona);
            setPersonaId(null);
        }
    }

    async function iniciar(tokenSesion) {
        try {
            const [cr, cfr, rc, mr] = await Promise.all([
                fetch("/publica/carta"),
                fetch("/publica/configuracion"),
                fetch(`/publica/codigo?token=${encodeURIComponent(tokenSesion)}`),
                fetch("/publica/menu-hoy")
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

            if (mr.ok) {
                setMenuHoy(await mr.json().catch(() => null));
            } else {
                setMenuHoy(null);
            }

            setMesaCerrada(false);
            setVista("bienvenida");
            setToken(tokenSesion);
            await cargarResumen(tokenSesion, localStorage.getItem(keyPersona));
        } catch (e) {
            setErrorGlobal("No se pudo conectar con el restaurante.");
        } finally {
            setCargando(false);
        }
    }

    // Inicializar sesion al montar
    useEffect(() => {
        if (!mesa) { setCargando(false); return; }
        let cancelled = false;
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
                    if (cancelled) return;
                    if (localStorage.getItem(keyPersona)) {
                        setPersonaId(localStorage.getItem(keyPersona));
                    }
                    await iniciar(saved);
                    return;
                } catch {
                    if (cancelled) return;
                    limpiarDatosLocalesMesa();
                }
            }

            if (cancelled) return;
            const resp = await solicitarSesion(mesa);
            if (cancelled) return;
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
            if (cancelled) return;
            await iniciar(resp.data.token);
        })();

        return () => { cancelled = true; };
    }, [mesa]);

    async function unirseConCodigo() {
        if (!codigoInput.trim()) {
            setErrorCodigo("Introduce un codigo valido.");
            return;
        }
        setCargando(true);
        const resp = await solicitarSesion(mesa, codigoInput.trim().toUpperCase());
        if (!resp.ok) {
            setErrorCodigo(resp.error === "CODIGO_INVALIDO"
                ? "Codigo incorrecto. Intentalo de nuevo."
                : "No se pudo validar el codigo.");
            setCargando(false);
            return;
        }

        setCodigoInput("");
        await prepararSesionActiva(resp.data, { asignarPersonaGrupo: true });
        await iniciar(resp.data.token);
    }

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

    function anadir(plato)  { setCarrito(prev => [...prev, { plato, persona: 1 }]); }
    function quitar(i)      { setCarrito(prev => prev.filter((_, idx) => idx !== i)); }
    function ciclarPersona(i) {
        setCarrito(prev => prev.map((item, idx) =>
            idx === i ? { ...item, persona: (item.persona % nPersonas) + 1 } : item
        ));
    }

    function totalesPorPersona() {
        const t = {};
        for (let p = 1; p <= nPersonas; p++) t[p] = { items: [], total: 0 };
        carrito.forEach(({ plato, persona }) => {
            t[persona].items.push(plato);
            t[persona].total += Number(plato.precio);
        });
        return t;
    }

    async function confirmarPedido() {
        if (!carrito.length || !token) return;
        setEnviando(true);
        try {
            const personasUnicas = [...new Set(carrito.map(i =>
                modoMesa === "GRUPO" ? Number(personaId || 1) : i.persona
            ))];
            const mapActualizado = { ...comensalesMap };
            for (const num of personasUnicas) {
                if (!mapActualizado[num]) {
                    const cid = await obtenerOCrearComensal(token, num);
                    if (cid) mapActualizado[num] = cid;
                }
            }
            setComensalesMap(mapActualizado);

            const res = await fetch("/publica/pedidos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    items: carrito.map(i => {
                        const personaNum = modoMesa === "GRUPO" ? Number(personaId || 1) : i.persona;
                        return {
                            platoId: i.plato.id,
                            persona: personaNum,
                            comensalId: mapActualizado[personaNum] || undefined,
                            precio: i.plato.precio,
                            esMenu: i.esMenu || false
                        };
                    })
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
                if (res.status === 409) {
                    const d = await res.json().catch(() => ({}));
                    if (d.error === "MENU_YA_PEDIDO") {
                        mostrarToast(idioma === "en" ? "This person already has a menu." : "Este comensal ya tiene un menu.", "error");
                        return;
                    }
                }
                const d = await res.json().catch(() => ({}));
                mostrarToast(d.error || "Error al enviar.", "error");
            }
        } catch { mostrarToast("Error de conexion.", "error"); }
        finally { setEnviando(false); }
    }

    const primary       = config?.colorPrimario   || "#0d9488";
    const secondary     = config?.colorSecundario || "#134e4a";
    const nombreRestaurante = config?.nombreRestaurante || "Restaurante";
    const totalCarrito  = carrito.reduce((s, i) => s + Number(i.plato.precio), 0);
    const idiomasDisponibles = (config?.idiomaCarta || "es").split(",").map(s => s.trim()).filter(Boolean);
    const mostrarSelectorIdioma = idiomasDisponibles.length > 1;

    const personaParaMenuCheck = modoMesa === "GRUPO" ? Number(personaId || 1) : 1;
    const menuYaPedido =
        carrito.some(item => item.esMenu && item.persona === personaParaMenuCheck) ||
        (resumenMesa?.pedidos || []).some(
            p => p.esMenu && p.estado !== "Cancelado" && p.persona === personaParaMenuCheck
        );

    function nombrePlato(plato)  { return (idioma === "en" && plato.nombreEn)  || plato.nombre; }
    function descPlato(plato)    { return (idioma === "en" && plato.descripcionEn) || plato.descripcion; }
    function nombreSeccion(sec)  { return (idioma === "en" && sec.nombreEn)    || sec.nombre; }

    /* â”€â”€ CARGANDO â”€â”€ */
    if (cargando) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-sm animate-pulse">Cargando...</p>
        </div>
    );

    /* â”€â”€ SIN MESA â”€â”€ */
    if (!mesa) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <div className="mb-4 text-amber-400"><Smartphone size={56} /></div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Escanea el QR de tu mesa</h1>
            <p className="text-gray-500">Usa la camara de tu movil para escanear el codigo QR que hay en tu mesa.</p>
        </div>
    );

    if (requiereCodigo) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow border p-6">
                <div className="mb-3 text-amber-500 flex justify-center"><Smartphone size={34} /></div>
                <h1 className="text-lg font-semibold text-gray-800 mb-2">
                    {idioma === "en" ? "Join table" : "Unirse a la mesa"}
                </h1>
                <p className="text-sm text-gray-500 mb-4">
                    {idioma === "en"
                        ? "Enter the table access code to place orders."
                        : "Introduce el codigo de acceso de la mesa para poder pedir."}
                </p>
                <input
                    type="text"
                    value={codigoInput}
                    onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                    placeholder={idioma === "en" ? "Access code" : "Codigo de acceso"}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-center tracking-widest font-semibold"
                    maxLength={8}
                />
                {errorCodigo && <p className="text-xs text-red-500 mb-3">{errorCodigo}</p>}
                <button
                    onClick={unirseConCodigo}
                    className="w-full bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700 transition font-medium"
                >
                    {idioma === "en" ? "Join table" : "Entrar a la mesa"}
                </button>
            </div>
        </div>
    );

    if (mesaCerrada) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <div className="mb-4 text-amber-500"><AlertTriangle size={48} /></div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">La mesa fue cerrada</h1>
            <p className="text-gray-500">Escanea el QR para iniciar nueva sesion.</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm"
            >
                Reintentar
            </button>
        </div>
    );

    /* â”€â”€ ERROR GLOBAL â”€â”€ */
    if (errorGlobal) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <div className="mb-4 text-amber-500"><AlertTriangle size={48} /></div>
            <p className="text-gray-700">{errorGlobal}</p>
            <button
                onClick={() => { limpiarDatosLocalesMesa(); window.location.reload(); }}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm"
            >
                Reintentar
            </button>
        </div>
    );

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       VISTA: BIENVENIDA
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    async function establecerModo(modoElegido) {
        setCargando(true);
        try {
            const res = await fetch("/publica/sesion/modo", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, modo: modoElegido })
            });
            if (res.ok) {
                if (modoElegido === "GRUPO") {
                    localStorage.setItem(keyPersona, "1");
                    setPersonaId("1");
                } else {
                    localStorage.removeItem(keyPersona);
                    setPersonaId(null);
                }
                const data = await res.json().catch(() => ({}));
                setModoMesa(data?.modo || modoElegido);
            }
        } catch {}
        setCargando(false);
    }

    if (vista === "bienvenida" && modoMesa === "PENDIENTE") return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">¿Cómo vas a pedir?</h1>
            <p className="text-gray-500 mb-8">Elige el modo para esta mesa. Esto no se podrá cambiar más tarde.</p>
            <div className="flex flex-col gap-4 w-full max-w-sm">
                <button onClick={() => establecerModo("INDIVIDUAL")} className="bg-white border-2 border-amber-500 rounded-2xl p-4 shadow-sm hover:bg-amber-50 transition text-left">
                    <h3 className="font-bold text-amber-600 text-lg flex items-center gap-2"><Users size={20} /> Modo Individual</h3>
                    <p className="text-gray-500 text-sm mt-1">Tú harás todos los pedidos desde tu dispositivo (podrás dividir la cuenta al final). Nadie más podrá unirse a la mesa.</p>
                </button>
                <button onClick={() => establecerModo("GRUPO")} className="bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-sm hover:bg-emerald-50 transition text-left">
                    <h3 className="font-bold text-emerald-600 text-lg flex items-center gap-2"><Smartphone size={20} /> Modo Grupo</h3>
                    <p className="text-gray-500 text-sm mt-1">Cada persona escaneará el QR con su móvil, introducirá el PIN y pedirá lo suyo. La cuenta se divide automáticamente.</p>
                </button>
            </div>
        </div>
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

            {/* Selector de idioma arriba a la derecha */}
            {mostrarSelectorIdioma && (
                <div className="relative z-10 flex justify-end gap-2 px-5 pt-5">
                    {idiomasDisponibles.map(lang => (
                        <button key={lang} onClick={() => setIdioma(lang)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                idioma === lang
                                    ? "bg-white text-gray-800"
                                    : "bg-white/20 text-white/70 hover:bg-white/30"
                            }`}>
                            {lang === "es" ? "ES" : "EN"}
                        </button>
                    ))}
                </div>
            )}

            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-white text-center">
                {config?.logo && (
                    <img src={`/uploads/Configuracion/${config.logo}`}
                        className="w-28 h-28 rounded-full object-cover mb-5 shadow-2xl border-4 border-white/30"
                        alt="logo" />
                )}
                <h1 className="text-3xl font-bold mb-1 drop-shadow-lg">{nombreRestaurante}</h1>
                <p className="text-white/60 text-sm mb-10">{idioma === "en" ? "Table" : "Mesa"} {mesa}</p>
                {codigoMesaActual && modoMesa !== "INDIVIDUAL" && (
                    <div className="mb-6 px-4 py-2 rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm">
                        <p className="text-xs text-white/80 mb-1">
                            {idioma === "en" ? "Share this table code" : "Comparte este codigo de mesa"}
                        </p>
                        <p className="text-lg font-bold tracking-widest">{codigoMesaActual}</p>
                    </div>
                )}
                <p className="text-lg font-medium mb-8 text-white/90">
                    {idioma === "en" ? "Welcome! What would you like?" : "Bienvenido/a! Que deseas?"}
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button onClick={() => setVista("carta")}
                        className="py-4 rounded-2xl font-semibold text-base shadow-xl transition active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm"
                        style={{ backgroundColor: primary, color: "#fff" }}>
                        <UtensilsCrossed size={20} />
                        {idioma === "en" ? "View menu" : "Ver la carta"}
                    </button>
                    {menuHoy ? (
                        <button onClick={() => setVista("menu")}
                            className="py-4 rounded-2xl font-semibold text-base shadow-xl transition active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm bg-white/20 text-white border border-white/30">
                            <ClipboardList size={20} />
                            {idioma === "en" ? "Daily menu" : "Menu del dia"}
                        </button>
                    ) : (
                        <button disabled
                            className="py-4 rounded-2xl font-semibold text-base bg-white/15 text-white/50 cursor-not-allowed flex flex-col items-center backdrop-blur-sm border border-white/10">
                            <span className="flex items-center gap-2"><ClipboardList size={20} />
                                {idioma === "en" ? "Daily menu" : "Menu del dia"}
                            </span>
                            <span className="block text-xs font-normal mt-0.5 opacity-60">
                                {idioma === "en" ? "Not available today" : "No disponible hoy"}
                            </span>
                        </button>
                    )}
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
                        {idioma === "en" ? "My orders" : "Mis pedidos"}
                    </h1>
                </div>
                {mostrarSelectorIdioma && (
                    <div className="flex gap-1">
                        {idiomasDisponibles.map(lang => (
                            <button key={lang} onClick={() => setIdioma(lang)}
                                className={`px-2 py-1 rounded text-xs font-semibold transition ${
                                    idioma === lang ? "text-white" : "bg-gray-100 text-gray-500"
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
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
                                <p className="text-xs text-gray-400">{modoMesa === "GRUPO" ? (idioma === "en" ? "Your share" : "Tu parte") : (idioma === "en" ? "Total table" : "Total mesa")}</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">
                                    {Number(modoMesa === "GRUPO" ? resumenMesa.subtotalPersonaActual : resumenMesa.totalMesa || 0).toFixed(2)} €
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
                                <p className="text-xs text-gray-400">{idioma === "en" ? "Payment status" : "Estado de cobro"}</p>
                                <p className="text-sm font-semibold text-gray-800 mt-1">{etiquetaEstadoCobro(resumenMesa.estadoCobro)}</p>
                                <p className="text-xs text-gray-400 mt-1">{etiquetaMetodoPago(resumenMesa.metodoPagoSolicitado)}</p>
                            </div>
                        </div>

                        {modoMesa === "GRUPO" && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
                                <p className="text-xs text-gray-400">{idioma === "en" ? "Table total" : "Total mesa"}</p>
                                <p className="text-lg font-bold text-gray-800 mt-1">{Number(resumenMesa.totalMesa || 0).toFixed(2)} €</p>
                            </div>
                        )}

                        {modoMesa !== "GRUPO" && Array.isArray(resumenMesa.totalesPorPersona) && resumenMesa.totalesPorPersona.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <p className="text-sm font-semibold text-gray-800 mb-3">{idioma === "en" ? "Split by person" : "Reparto por persona"}</p>
                                <div className="space-y-2">
                                    {resumenMesa.totalesPorPersona.map((persona) => (
                                        <div key={persona.persona} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">P{persona.persona}</p>
                                                <p className="text-xs text-gray-500">
                                                    {Array.isArray(persona.items) && persona.items.length > 0
                                                        ? persona.items.map(item => item.nombre).join(", ")
                                                        : (idioma === "en" ? "No items" : "Sin platos")}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-800">{Number(persona.total || 0).toFixed(2)} €</p>
                                                <p className={`text-xs ${persona.cobrado ? "text-emerald-600" : "text-amber-600"}`}>
                                                    {persona.cobrado ? (idioma === "en" ? "Paid" : "Cobrado") : (idioma === "en" ? "Pending" : "Pendiente")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <p className="text-sm font-semibold text-gray-800 mb-3">{idioma === "en" ? "Request payment" : "Solicitar cobro"}</p>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {[
                                    { val: "metalico", label: idioma === "en" ? "Cash" : "Metalico" },
                                    { val: "tarjeta", label: idioma === "en" ? "Card" : "Tarjeta" },
                                    { val: "bizum", label: "Bizum" },
                                ].map(op => (
                                    <button
                                        key={op.val}
                                        onClick={() => setMetodoPago(op.val)}
                                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                                            metodoPago === op.val
                                                ? "bg-amber-500 border-amber-500 text-white"
                                                : "bg-white border-gray-200 text-gray-600"
                                        }`}
                                    >
                                        {op.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={solicitarCobroMesa}
                                    disabled={solicitandoCobro || misPedidos.length === 0}
                                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                        solicitandoCobro || misPedidos.length === 0
                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                                    }`}
                                >
                                    {solicitandoCobro
                                        ? (idioma === "en" ? "Requesting..." : "Solicitando...")
                                        : (idioma === "en" ? "Call waiter to pay" : "Llamar al camarero para cobrar")}
                                </button>
                                <button
                                    onClick={descargarTicket}
                                    disabled={descargandoTicket || misPedidos.length === 0}
                                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                        descargandoTicket || misPedidos.length === 0
                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            : "bg-slate-800 text-white hover:bg-slate-900"
                                    }`}
                                >
                                    {descargandoTicket ? (idioma === "en" ? "Preparing..." : "Preparando...") : (idioma === "en" ? "Ticket" : "Ticket")}
                                </button>
                            </div>
                        </div>
                    </>
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
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <p className="font-medium text-sm text-gray-800">{p.plato?.nombre}</p>
                                            {p.esMenu && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">Menú</span>}
                                            <span className="text-xs text-amber-600 font-bold">P{personaPedido}</span>
                                        </div>
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

    /* ════════════════════════════════════════
       VISTA: MENU DEL DIA
    ════════════════════════════════════════ */
    const TIPO_LABEL = { PRIMERO: { es: 'Primeros', en: 'Starters' }, SEGUNDO: { es: 'Segundos', en: 'Mains' }, POSTRE: { es: 'Postres', en: 'Desserts' }, BEBIDA: { es: 'Bebidas', en: 'Drinks' } };
    const TIPO_ORDEN = ['PRIMERO', 'SEGUNDO', 'POSTRE', 'BEBIDA'];

    if (vista === 'menu' && menuHoy) {
        const grupos = TIPO_ORDEN.reduce((acc, tipo) => {
            const items = (menuHoy.items || []).filter(i => i.tipoPlato === tipo);
            if (items.length) acc.push({ tipo, items });
            return acc;
        }, []);
        const diasES = { Lunes:'Lunes', Martes:'Martes', Miercoles:'Miercoles', Jueves:'Jueves', Viernes:'Viernes', Sabado:'Sabado', Domingo:'Domingo' };
        const diasEN = { Lunes:'Monday', Martes:'Tuesday', Miercoles:'Wednesday', Jueves:'Thursday', Viernes:'Friday', Sabado:'Saturday', Domingo:'Sunday' };
        const nombreDia = idioma === 'en' ? (diasEN[menuHoy.dia] || menuHoy.dia) : (diasES[menuHoy.dia] || menuHoy.dia);

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                    <button onClick={() => setVista('bienvenida')} className="text-gray-500 hover:text-gray-800 transition">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <p className="text-xs text-gray-400">{idioma === 'en' ? 'Table' : 'Mesa'} {mesa}</p>
                        <h1 className="font-semibold text-sm text-gray-800">
                            {idioma === 'en' ? `${nombreDia}'s menu` : `Menu del ${nombreDia}`}
                        </h1>
                    </div>
                    <button onClick={() => setVista('pedidos')}
                        className="relative flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 transition">
                        <ClipboardList size={14} /> {idioma === 'en' ? 'My orders' : 'Mis pedidos'}
                        {listosBadge > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {listosBadge}
                            </span>
                        )}
                    </button>
                </div>

                {mostrarSelectorIdioma && (
                    <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2">
                        {idiomasDisponibles.map(lang => (
                            <button key={lang} onClick={() => setIdioma(lang)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${idioma === lang ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                style={idioma === lang ? { backgroundColor: primary } : {}}>
                                {lang === 'es' ? 'ES • Espanol' : 'EN • English'}
                            </button>
                        ))}
                    </div>
                )}

                <div className="max-w-lg mx-auto px-3 py-4 pb-44">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-500">{idioma === 'en' ? 'Menu price' : 'Precio del menu'}</p>
                        <p className="text-xl font-bold" style={{ color: primary }}>{Number(menuHoy.precio).toFixed(2)} €</p>
                    </div>
                    {grupos.map(({ tipo, items }) => (
                        <div key={tipo} className="mb-4">
                            <p className="px-4 py-2 rounded-xl font-semibold text-sm text-white mb-1" style={{ backgroundColor: primary }}>
                                {idioma === 'en' ? TIPO_LABEL[tipo]?.en : TIPO_LABEL[tipo]?.es}
                                <span className="ml-2 font-normal text-xs opacity-80">
                                    {idioma === 'en' ? '— choose one' : '— elige uno'}
                                </span>
                            </p>
                            <div className="space-y-2">
                                {items.map(item => {
                                    const plato = item.plato;
                                    if (!plato) return null;
                                    const seleccionado = seleccionMenu[tipo]?.id === plato.id;
                                    return (
                                        <div key={item.id}
                                            onClick={() => setSeleccionMenu(prev => ({ ...prev, [tipo]: plato }))}
                                            className={`rounded-xl border-2 flex items-center gap-3 px-3 py-2 cursor-pointer transition ${seleccionado ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:shadow-md'}`}>
                                            {plato.imagen && (
                                                <img src={`/uploads/FotoPlatos/${plato.imagen}`}
                                                    className="w-16 h-16 rounded-lg object-cover shrink-0" alt={plato.nombre} />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-medium text-sm truncate ${seleccionado ? 'text-emerald-700' : 'text-gray-800'}`}>
                                                    {(idioma === 'en' && plato.nombreEn) || plato.nombre}
                                                </p>
                                                {((idioma === 'en' && plato.descripcionEn) || plato.descripcion) && (
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                        {(idioma === 'en' && plato.descripcionEn) || plato.descripcion}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${seleccionado ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                                                {seleccionado && <CheckCircle2 size={16} className="text-white" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl px-4 py-3 z-40">
                    <div className="max-w-lg mx-auto">
                        {Object.keys(seleccionMenu).length > 0 && (
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-500">
                                    {Object.keys(seleccionMenu).length}/{grupos.length} {idioma === 'en' ? 'chosen' : 'elegidas'}
                                </p>
                                <p className="text-sm font-bold" style={{ color: primary }}>{Number(menuHoy.precio).toFixed(2)} €</p>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const precioPorPlato = menuHoy.precio / grupos.length;
                                    const persona = modoMesa === 'GRUPO' ? Number(personaId || 1) : 1;
                                    Object.values(seleccionMenu).forEach(plato =>
                                        setCarrito(prev => [...prev, { plato: { ...plato, precio: precioPorPlato }, persona, esMenu: true }])
                                    );
                                    setSeleccionMenu({});
                                }}
                                disabled={Object.keys(seleccionMenu).length < grupos.length || menuYaPedido}
                                className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition flex items-center justify-center gap-2 ${Object.keys(seleccionMenu).length < grupos.length || menuYaPedido ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                                <Plus size={16} />
                                {menuYaPedido
                                    ? (idioma === 'en' ? 'Menu already ordered' : 'Ya tienes un menú')
                                    : Object.keys(seleccionMenu).length < grupos.length
                                        ? (idioma === 'en' ? `Choose all (${Object.keys(seleccionMenu).length}/${grupos.length})` : `Elige todas (${Object.keys(seleccionMenu).length}/${grupos.length})`)
                                        : (idioma === 'en'
                                            ? `Add menu · ${Number(menuHoy.precio).toFixed(2)}€`
                                            : `Añadir menú · ${Number(menuHoy.precio).toFixed(2)}€`)
                                }
                            </button>
                            {carrito.length > 0 && (
                                <button onClick={() => setCheckout(true)}
                                    className="px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition flex items-center gap-1.5"
                                    style={{ backgroundColor: secondary }}>
                                    <ShoppingCart size={16} /> {carrito.length}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {checkout && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
                        <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10">
                                <h2 className="font-bold text-gray-800 text-base">{idioma === 'en' ? 'Confirm order' : 'Confirmar pedido'}</h2>
                                <button onClick={() => setCheckout(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
                            </div>
                            <div className="px-5 py-4 space-y-6">
                                {modoMesa !== 'GRUPO' && (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Users size={16} /> {idioma === 'en' ? 'How many people are paying?' : 'Cuantas personas pagais?'}</p>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setNPersonas(p => Math.max(1, p - 1))} className="w-9 h-9 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition flex items-center justify-center"><Minus size={16} /></button>
                                            <span className="text-xl font-bold w-6 text-center">{nPersonas}</span>
                                            <button onClick={() => setNPersonas(p => Math.min(8, p + 1))} className="w-9 h-9 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition flex items-center justify-center"><Plus size={16} /></button>
                                            <span className="text-sm text-gray-500">{nPersonas === 1 ? (idioma === 'en' ? 'Single payment' : 'Pago unico') : (idioma === 'en' ? `${nPersonas} people` : `${nPersonas} personas`)}</span>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <UtensilsCrossed size={16} /> {idioma === 'en' ? 'Your order' : 'Tu pedido'}
                                        {nPersonas > 1 && <span className="text-xs font-normal text-gray-400 ml-1">{idioma === 'en' ? 'Tap the color button to assign person' : 'Toca el boton de color para asignar persona'}</span>}
                                    </p>
                                    <div className="space-y-2">
                                        {carrito.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-sm font-medium text-gray-800">{item.plato.nombre}</p>
                                                        {item.esMenu && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">Menú</span>}
                                                    </div>
                                                    <p className="text-xs text-gray-500">{Number(item.plato.precio).toFixed(2)} €</p>
                                                </div>
                                                {nPersonas > 1 && modoMesa !== 'GRUPO' && (
                                                    <button onClick={() => ciclarPersona(i)}
                                                        className="text-white text-xs font-bold px-2.5 py-1 rounded-full"
                                                        style={{ backgroundColor: PERSONA_COLORES[(item.persona - 1) % PERSONA_COLORES.length] }}>
                                                        P{item.persona}
                                                    </button>
                                                )}
                                                <button onClick={() => quitar(i)} className="text-gray-300 hover:text-red-400 transition"><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {nPersonas > 1 && modoMesa !== 'GRUPO' && (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">{idioma === 'en' ? 'Total per person' : 'Total por persona'}</p>
                                        <div className="space-y-2">
                                            {Object.entries(totalesPorPersona()).map(([p, data]) => (
                                                <div key={p} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                                                            style={{ backgroundColor: PERSONA_COLORES[(Number(p) - 1) % PERSONA_COLORES.length] }}>
                                                            P{p}
                                                        </span>
                                                        <span className="text-xs text-gray-500 truncate max-w-[160px]">
                                                            {data.items.length === 0 ? (idioma === 'en' ? 'Unassigned' : 'Sin asignar') : data.items.map(pl => pl.nombre).join(', ')}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800 shrink-0">{data.total.toFixed(2)} €</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center border-t pt-4">
                                    <p className="font-semibold text-gray-700">Total</p>
                                    <p className="text-xl font-bold" style={{ color: primary }}>{totalCarrito.toFixed(2)} €</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <CreditCard size={16} /> {idioma === 'en' ? 'How would you like to pay?' : 'Como quereis pagar?'}
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { val: 'metalico', icono: <Banknote size={28} />, label: idioma === 'en' ? 'Cash' : 'Metalico' },
                                            { val: 'tarjeta',  icono: <CreditCard size={28} />, label: idioma === 'en' ? 'Card' : 'Tarjeta' },
                                            { val: 'bizum',    icono: <Smartphone size={28} />, label: 'Bizum' },
                                        ].map(op => (
                                            <button key={op.val} onClick={() => setMetodoPago(op.val)}
                                                className={`flex flex-col items-center py-4 rounded-xl border-2 text-sm font-medium transition ${metodoPago === op.val ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'}`}>
                                                <span className="mb-1">{op.icono}</span>
                                                {op.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center">{idioma === 'en' ? 'A waiter will come to take payment shortly.' : 'El camarero/a pasara a cobrar en breve.'}</p>
                                </div>
                            </div>
                            <div className="px-5 pb-6 pt-3 border-t sticky bottom-0 bg-white">
                                <button onClick={confirmarPedido} disabled={enviando || carrito.length === 0}
                                    className={`w-full py-3 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2 ${enviando || carrito.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                                    {enviando ? <><Loader2 size={16} className="animate-spin" /> {idioma === 'en' ? 'Sending...' : 'Enviando...'}</> : (idioma === 'en' ? `Send order · ${totalCarrito.toFixed(2)} €` : `Enviar pedido · ${totalCarrito.toFixed(2)} €`)}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {toast && (
                    <div className={`fixed top-4 left-1/2 -translate-x-1/2 text-white text-sm px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${toast.tipo === 'ok' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                        {toast.tipo === 'ok' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        {toast.msg}
                    </div>
                )}
            </div>
        );
    }

    /*â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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
                    <ClipboardList size={14} /> {idioma === "en" ? "My orders" : "Mis pedidos"}
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
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                                idioma === lang ? "text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
                                    className={`text-xs rounded-full px-3 py-1 cursor-pointer hover:bg-red-100 hover:text-red-600 transition flex items-center gap-1 ${item.esMenu ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100'}`}>
                                    {item.esMenu && <span className="font-bold text-emerald-600">M·</span>}
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

                            {/* Nº personas */}
                            {modoMesa !== "GRUPO" && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Users size={16} /> {idioma === "en" ? "How many people are paying?" : "Cuantas personas pagais?"}</p>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setNPersonas(p => Math.max(1, p - 1))}
                                            className="w-9 h-9 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition flex items-center justify-center">
                                            <Minus size={16} />
                                        </button>
                                        <span className="text-xl font-bold w-6 text-center">{nPersonas}</span>
                                        <button onClick={() => setNPersonas(p => Math.min(8, p + 1))}
                                            className="w-9 h-9 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition flex items-center justify-center">
                                            <Plus size={16} />
                                        </button>
                                        <span className="text-sm text-gray-500">{nPersonas === 1 ? (idioma === "en" ? "Single payment" : "Pago unico") : (idioma === "en" ? `${nPersonas} people` : `${nPersonas} personas`)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Items con asignacion de persona */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <UtensilsCrossed size={16} /> {idioma === "en" ? "Your order" : "Tu pedido"}
                                    {nPersonas > 1 && <span className="text-xs font-normal text-gray-400 ml-1">{idioma === "en" ? "Tap the color button to assign person" : "Toca el boton de color para asignar persona"}</span>}
                                </p>
                                <div className="space-y-2">
                                    {carrito.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-sm font-medium text-gray-800">{item.plato.nombre}</p>
                                                    {item.esMenu && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">Menú</span>}
                                                </div>
                                                <p className="text-xs text-gray-500">{Number(item.plato.precio).toFixed(2)} €</p>
                                            </div>
                                            {nPersonas > 1 && modoMesa !== "GRUPO" && (
        <button onClick={() => ciclarPersona(i)}
                                                    className="text-white text-xs font-bold px-2.5 py-1 rounded-full"
                                                    style={{ backgroundColor: PERSONA_COLORES[(item.persona - 1) % PERSONA_COLORES.length] }}>
                                                    P{item.persona}
                                                </button>
                                            )}
                                            <button onClick={() => quitar(i)} className="text-gray-300 hover:text-red-400 transition"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totales por persona */}
                            {nPersonas > 1 && modoMesa !== "GRUPO" && (
        <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">{idioma === "en" ? "Total per person" : "Total por persona"}</p>
                                    <div className="space-y-2">
                                        {Object.entries(totalesPorPersona()).map(([p, data]) => (
                                            <div key={p} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                                                        style={{ backgroundColor: PERSONA_COLORES[(Number(p) - 1) % PERSONA_COLORES.length] }}>
                                                        P{p}
                                                    </span>
                                                    <span className="text-xs text-gray-500 truncate max-w-[160px]">
                                                        {data.items.length === 0 ? (idioma === "en" ? "Unassigned" : "Sin asignar") : data.items.map(pl => pl.nombre).join(", ")}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-800 shrink-0">{data.total.toFixed(2)} €</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="flex justify-between items-center border-t pt-4">
                                <p className="font-semibold text-gray-700">{idioma === "en" ? "Total" : "Total"}</p>
                                <p className="text-xl font-bold" style={{ color: primary }}>{totalCarrito.toFixed(2)} €</p>
                            </div>

                            {/* Metodo de pago */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <CreditCard size={16} /> {idioma === "en" ? "How would you like to pay?" : "Como quereis pagar?"}
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { val: "metalico", icono: <Banknote size={28} />, label: idioma === "en" ? "Cash" : "Metalico" },
                                        { val: "tarjeta",  icono: <CreditCard size={28} />, label: idioma === "en" ? "Card" : "Tarjeta" },
                                        { val: "bizum",  icono: <Smartphone size={28} />, label: "Bizum" },
                                    ].map(op => (
                                        <button key={op.val} onClick={() => setMetodoPago(op.val)}
                                            className={`flex flex-col items-center py-4 rounded-xl border-2 text-sm font-medium transition ${
                                                metodoPago === op.val
                                                    ? "bg-amber-500 border-amber-500 text-white"
                                                    : "border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50"
                                            }`}>
                                            <span className="mb-1">{op.icono}</span>
                                            {op.label}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2 text-center">{idioma === "en" ? "A waiter will come to take payment shortly." : "El camarero/a pasara a cobrar en breve."}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-6 pt-3 border-t sticky bottom-0 bg-white">
                            <button onClick={confirmarPedido} disabled={enviando || carrito.length === 0}
                                className={`w-full py-3 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2 ${
                                    enviando || carrito.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                                }`}>
                                {enviando ? <><Loader2 size={16} className="animate-spin" /> {idioma === "en" ? "Sending..." : "Enviando..."}</> : (idioma === "en" ? `Send order · ${totalCarrito.toFixed(2)} €` : `Enviar pedido · ${totalCarrito.toFixed(2)} €`)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 text-white text-sm px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${
                    toast.tipo === "ok" ? "bg-emerald-600" : "bg-red-600"
                }`}>
                    {toast.tipo === "ok" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
}


