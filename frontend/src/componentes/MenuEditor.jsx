import { useEffect, useRef, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";
import deleteIcon from "../assets/iconos/eliminar.png";

function MenuEditor() {
    const { t, idioma } = useIdioma();

    const [menus, setMenus] = useState([]);
    const [diaMenu, setDiaMenu] = useState("");
    const [precioMenu, setPrecioMenu] = useState("");
    const [menuSeleccionadoId, setMenuSeleccionadoId] = useState(null);
    const [menu, setMenu] = useState(null);
    const [platos, setPlatos] = useState([]);
    const [categoriasAbiertas, setCategoriassAbiertas] = useState({});
    const [modalNuevoMenu, setModalNuevoMenu] = useState(false);
    const [modalAñadir, setModalAñadir] = useState(null);
    const [modalAñadirTipoPlato, setModalAñadirTipoPlato] = useState(null);
    const [nombreNuevoMenu, setNombreNuevoMenu] = useState("");
    const [busquedaMenu, setBusquedaMenu] = useState("");
    const [busquedaPlato, setBusquedaPlato] = useState("");
    const [confirmarEliminarMenu, setConfirmarEliminarMenu] = useState(false);

    useEffect(() => {
        cargarMenus();
        authFetch("/platos").then(r => r.json()).then(setPlatos);
    }, []);

    useEffect(() => {
        if (menuSeleccionadoId) cargarMenu(menuSeleccionadoId);
    }, [menuSeleccionadoId]);

    useEffect(() => {
        if (!busquedaMenu.trim()) return;
        const match = menus.find(m => normalize(m.dia).includes(normalize(busquedaMenu.toLowerCase())));
        if (match) setMenuSeleccionadoId(match.id);
    }, [busquedaMenu, menus]);

    function cargarMenus() {
        authFetch("/menus")
            .then(r => r.json())
            .then(data => {
                setMenus(data);
                if (data.length > 0 && !menuSeleccionadoId) {
                    setMenuSeleccionadoId(data[0].id);
                }
            });
    }

    function cargarMenu(id) {
        authFetch(`/menus/${id}`)
            .then(r => r.json())
            .then(data => {
                setMenu(data);
                const abiertos = {};
                abiertos["primeros"] = true;
                abiertos["segundos"] = true;
                abiertos["postres"] = true;
                abiertos["bebidas"] = true;
                setCategoriassAbiertas(abiertos);
            });
    }

    function toggleCategoria(platosCategoria) {
        setCategoriassAbiertas(prev => ({ ...prev, [platosCategoria]: !prev[platosCategoria] }));
    }

    async function crearMenu() {
        if (!precioMenu) { alert("Introduce el precio del menú."); return; }
        if (!diaMenu) { alert("Selecciona el día del menú."); return; }
        const res = await authFetch("/menus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dia: diaMenu, precio: String(precioMenu)})
        });
        const nueva = await res.json();
        setNombreNuevoMenu("");
        setModalNuevoMenu(false);
        await cargarMenus();
        setMenuSeleccionadoId(nueva.id);
    }

    async function eliminarMenu() {
        if (!menuSeleccionadoId) return;
        await authFetch(`/menus/${menuSeleccionadoId}`, { method: "DELETE" });
        setConfirmarEliminarMenu(false);
        setMenu(null);
        cargarMenus();
        setMenuSeleccionadoId(menus[0]?.id || null);
    }

    async function añadirPlatoAMenu(platoId) {
        await authFetch(`/menus/${menuSeleccionadoId}/plato/${platoId}`, {
            method: "PUT"
        });
        setModalAñadir(null);
        setBusquedaPlato("");
        cargarMenu(menuSeleccionadoId);
    }

    async function eliminarPlatoMenu(platoId) {
        await authFetch(`/menus/${menuSeleccionadoId}/plato/${platoId}`, { method: "DELETE" });
        cargarMenu(menuSeleccionadoId);
    }

    async function moverItem(itemId, direccion) {
        await authFetch(`/menus/${menuSeleccionadoId}/plato/${itemId}/mover`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ direccion })
        });
        cargarMenu(menuSeleccionadoId);
    }

    // Platos que no están ya en el menú seleccionado
    function platosDisponiblesParaMenu(menuId) {
        const ids = new Set((menu?.items || []).map(i => i.plato?.id));
        
        return platos.filter(p => !ids.has(p.id) && p.disponible);
    }

    function normalize(text) {
        return (text ?? "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function tipoLabel(tipo) {
        const map = {
            PRIMERO: "carta.primero",
            SEGUNDO: "carta.segundo",
            POSTRE: "carta.postre",
            BEBIDA: "carta.bebida"
        };
        return map[tipo] ? t(map[tipo]) : tipo;
    }

    return (
        <div className="flex gap-4">

            {/* PANEL PRINCIPAL */}
            <div className="flex-1 min-w-0">

                {/* BARRA SUPERIOR */}
                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="text"
                        value={busquedaMenu}
                        onChange={e => setBusquedaMenu(e.target.value)}
                        placeholder={t("menu.buscarMenu")}
                        className="bg-gray-100 px-4 py-2 rounded-lg text-sm outline-none w-44"
                    />

                    <button
                        onClick={() => setModalNuevoMenu(true)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition whitespace-nowrap"
                    >
                        {t("menu.crearNuevoMenu")}
                    </button>
                    {menus.length > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                            <div className="relative">
                                <select
                                    value={menuSeleccionadoId || ""}
                                    onChange={e => setMenuSeleccionadoId(Number(e.target.value))}
                                    className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm pr-8 appearance-none"
                                >
                                    {(menus?? []).filter(m => normalize(m.dia).includes(normalize(busquedaMenu)))
                                        .map(m => (
                                            <option key={m.id} value={m.id}>{m.dia}</option>
                                        ))}
                                </select>
                                <span className="pointer-events-none absolute right-2 top-2.5 text-gray-400 text-xs">▼</span>
                            </div>
                            <button
                                onClick={() => setConfirmarEliminarMenu(true)}
                                title={t("menu.eliminarMenu")}
                                className="border border-red-200 text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm transition"
                            >
                                <img src={deleteIcon} className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
                {menus.length === 0  || menu === null? (
                    <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
                        {menus.length === 0 ? t("menu.sinMenus") : t("cargando")}
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl border mb-3 overflow-hidden">
                            <h3 className="text-lg font-semibold px-4 py-3 border-b">
                                {menu.dia === "Domingo" ? "Menu Especial " : "Menu diario "} {menu.dia} - {menu.precio.toFixed(2)} €
                            </h3>


                            {/* CABECERA SECCIÓN PRIMEROS */}
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                                <button
                                    onClick={() => toggleCategoria("primeros")}
                                    className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                                >
                                    {t("menu.primeros")}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setModalAñadir({ menuId: menuSeleccionadoId });setModalAñadirTipoPlato("PRIMERO"); setBusquedaPlato(""); }}
                                        className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg text-xs"
                                    >
                                        + {t("menu.añadirPlatoPrimerosMenu")}
                                    </button>
                                </div>
                            </div>
                            {/* TABLA DE PLATOS EN SECCIÓN PRIMEROS */}
                            {categoriasAbiertas["primeros"] && (
                                <table className="w-full text-sm">
                                    <thead className="text-gray-500 text-xs border-b bg-white">
                                        <tr>
                                            <th className="text-left px-4 py-2 w-8"></th>
                                            <th className="text-left px-4 py-2">{(t("menu.primeros"))}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {((menu?.items ?? []).filter(i => i.tipoPlato === "PRIMERO") || []).map((item, idx, arr) => (
                                            <tr key={item.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <button
                                                            onClick={() => moverItem(item.id, "subir")}
                                                            disabled={idx === 0}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▲</button>
                                                        <button
                                                            onClick={() => moverItem(item.id, "bajar")}
                                                            disabled={idx === arr.length - 1}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▼</button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        {item.plato?.imagen
                                                            ? <img src={`/uploads/FotoPlatos/${item.plato.imagen}`} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                            : <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />}
                                                        <span>{idioma === "en" && item.plato?.nombreEn ? item.plato.nombreEn : item.plato?.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => eliminarPlatoMenu(item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <img src={deleteIcon} className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {((menu?.items ?? []).filter(i => i.tipoPlato === "PRIMERO").length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-3 text-gray-400 text-xs text-center">
                                                    {t("menu.noHayPrimeros")}
                                                </td>
                                                <td />
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>


                        <div className="bg-white rounded-xl border mb-3 overflow-hidden">

                            {/* CABECERA SECCIÓN SEGUNDOS */}
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                                <button
                                    onClick={() => toggleCategoria("segundos")}
                                    className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                                >
                                    {t("menu.segundos")}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setModalAñadir({ menuId: menuSeleccionadoId });setModalAñadirTipoPlato("SEGUNDO"); setBusquedaPlato(""); }}
                                        className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg text-xs"
                                    >
                                        + {t("menu.añadirPlatoSegundosMenu")}
                                    </button>
                                </div>
                            </div>
                            {/* TABLA DE PLATOS EN SECCIÓN SEGUNDOS */}
                            {categoriasAbiertas["segundos"] && (
                                <table className="w-full text-sm">
                                    <thead className="text-gray-500 text-xs border-b bg-white">
                                        <tr>
                                            <th className="text-left px-4 py-2 w-8"></th>
                                            <th className="text-left px-4 py-2">{(t("menu.segundos"))}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { }
                                        {((menu?.items ?? []).filter(i => i.tipoPlato === "SEGUNDO") || []).map((item, idx, arr) => (
                                            <tr key={item.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <button
                                                            onClick={() => moverItem(item.id, "subir")}
                                                            disabled={idx === 0}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▲</button>
                                                        <button
                                                            onClick={() => moverItem(item.id, "bajar")}
                                                            disabled={idx === arr.length - 1}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▼</button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        {item.plato?.imagen
                                                            ? <img src={`/uploads/FotoPlatos/${item.plato.imagen}`} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                            : <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />}
                                                        <span>{idioma === "en" && item.plato?.nombreEn ? item.plato.nombreEn : item.plato?.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => eliminarPlatoMenu(item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <img src={deleteIcon} className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {((menu?.items ?? []).filter(i => i.tipoPlato === "SEGUNDO").length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-3 text-gray-400 text-xs text-center">
                                                    {t("menu.noHaySegundos")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border mb-3 overflow-hidden">

                            {/* CABECERA SECCIÓN POSTRES */}
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                                <button
                                    onClick={() => toggleCategoria("postres")}
                                    className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                                >
                                    {t("menu.postres")}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setModalAñadir({ menuId: menuSeleccionadoId }); setModalAñadirTipoPlato("POSTRE"); setBusquedaPlato(""); }}
                                        className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg text-xs"
                                    >
                                        + {t("menu.añadirPlatoPostresMenu")}
                                    </button>
                                </div>
                            </div>
                            {/* TABLA DE PLATOS EN SECCIÓN POSTRES */}
                            {categoriasAbiertas["postres"] && (
                                <table className="w-full text-sm">
                                    <thead className="text-gray-500 text-xs border-b bg-white">
                                        <tr>
                                            <th className="text-left px-4 py-2 w-8"></th>
                                            <th className="text-left px-4 py-2">{(t("menu.postres"))}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {((menu?.items ?? []).filter(i => i.tipoPlato === "POSTRE") || []).map((item, idx, arr) => (
                                            <tr key={item.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <button
                                                            onClick={() => moverItem(item.id, "subir")}
                                                            disabled={idx === 0}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▲</button>
                                                        <button
                                                            onClick={() => moverItem(item.id, "bajar")}
                                                            disabled={idx === arr.length - 1}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▼</button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        {item.plato?.imagen
                                                            ? <img src={`/uploads/FotoPlatos/${item.plato.imagen}`} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                            : <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />}
                                                        <span>{idioma === "en" && item.plato?.nombreEn ? item.plato.nombreEn : item.plato?.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => eliminarPlatoMenu(item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <img src={deleteIcon} className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {((menu?.items ?? []).filter(i => i.tipoPlato === "POSTRE").length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-3 text-gray-400 text-xs text-center">
                                                    {t("menu.noHayPostres")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border mb-3 overflow-hidden">

                            {/* CABECERA SECCIÓN BEBIDAS */}
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                                <button
                                    onClick={() => toggleCategoria("bebidas")}
                                    className="flex items-center gap-2 font-medium text-gray-700 text-sm"
                                >
                                    {t("menu.bebidas")}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setModalAñadir({ menuId: menuSeleccionadoId }); setModalAñadirTipoPlato("BEBIDA");setBusquedaPlato(""); }}
                                        className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg text-xs"
                                    >
                                        + {t("menu.añadirPlatoBebidasMenu")}
                                    </button>
                                </div>
                            </div>
                            {/* TABLA DE PLATOS EN SECCIÓN BEBIDAS */}
                            {categoriasAbiertas["bebidas"] && (
                                <table className="w-full text-sm">
                                    <thead className="text-gray-500 text-xs border-b bg-white">
                                        <tr>
                                            <th className="text-left px-4 py-2 w-8"></th>
                                            <th className="text-left px-4 py-2">{(t("menu.bebidas"))}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {((menu?.items ?? []).filter(i => i.tipoPlato === "BEBIDA") || []).map((item, idx, arr) => (
                                            <tr key={item.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <button
                                                            onClick={() => moverItem(item.id, "subir")}
                                                            disabled={idx === 0}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▲</button>
                                                        <button
                                                            onClick={() => moverItem(item.id, "bajar")}
                                                            disabled={idx === arr.length - 1}
                                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                                                        >▼</button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        {item.plato?.imagen
                                                            ? <img src={`/uploads/FotoPlatos/${item.plato.imagen}`} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                            : <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />}
                                                        <span>{idioma === "en" && item.plato?.nombreEn ? item.plato.nombreEn : item.plato?.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => eliminarPlatoMenu(item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <img src={deleteIcon} className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {((menu?.items ?? []).filter(i => i.tipoPlato === "BEBIDA").length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-3 text-gray-400 text-xs text-center">
                                                    {t("menu.noHayBebidas")}
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

            </div>
            {/* MODAL: NUEVO MENU */}
            {modalNuevoMenu && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalNuevoMenu(false)}>
                    <div className="bg-white rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold mb-4">{t("menu.crearNuevoMenu")}</h3>
                        <input
                            autoFocus
                            type="number"
                            range="0.01"
                            onChange={e => setPrecioMenu(e.target.value)}
                            placeholder={t("menu.precioMenu")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-emerald-500"
                        />
                        <select
                            onChange={e => setDiaMenu(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-emerald-500"
                        >
                            <option value="">{t("menu.seleccionarDia")}</option>
                            <option value="Lunes">{t("menu.diaLunes")}</option>
                            <option value="Martes">{t("menu.diaMartes")}</option>
                            <option value="Miercoles">{t("menu.diaMiercoles")}</option>
                            <option value="Jueves">{t("menu.diaJueves")}</option>
                            <option value="Viernes">{t("menu.diaViernes")}</option>
                            <option value="Sabado">{t("menu.diaSabado")}</option>
                            <option value="Domingo">{t("menu.diaDomingo")}</option>
                        </select>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setModalNuevoMenu(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">
                                {t("menu.cancelar")}
                            </button>
                            <button onClick={() => crearMenu()} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700">
                                {t("menu.guardar")}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* MODAL: AÑADIR PLATO A MENU */}
            {modalAñadir && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalAñadir(null)}>
                    <div className="bg-white rounded-xl p-6 w-96 shadow-xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold mb-3">{t("menu.seleccionarPlato")}</h3>
                        <input
                            autoFocus
                            type="text"
                            value={busquedaPlato}
                            onChange={e => setBusquedaPlato(e.target.value)}
                            placeholder={t("menu.buscarMenu")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-emerald-500"
                        />
                        <div className="overflow-y-auto flex-1">
                            <h3 className="font-semibold mb-2">{tipoLabel(modalAñadirTipoPlato)+"s"}</h3>
                            {platosDisponiblesParaMenu(menu.id)
                                .filter(p => p.tipo === modalAñadirTipoPlato && normalize(p.nombre).includes(normalize(busquedaPlato)))
                                .map(plato => (
                                    <button
                                        key={plato.id}
                                        onClick={() => añadirPlatoAMenu(plato.id)}
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
            )
            }

            {/* MODAL: CONFIRMAR ELIMINAR MENU */}
            {confirmarEliminarMenu && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setConfirmarEliminarMenu(false)}>
                    <div className="bg-white rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold text-red-700 mb-2">{t("menu.eliminarMenu")}</h3>
                        <p className="text-sm text-gray-600 mb-5">
                            {t("menu.confirmarEliminar")} <strong>Menu del {menu?.dia}</strong>.
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmarEliminarMenu(false)}
                                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">
                                {t("cancelar")}
                            </button>
                            <button onClick={eliminarMenu}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition">
                                {t("menu.eliminarMenu")}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
}
export default MenuEditor;