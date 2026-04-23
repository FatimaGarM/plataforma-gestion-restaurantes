import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import FormularioPlato from "../formularios/FormularioPlato";
import ConfirmacionEliminar from "../componentes/ConfirmacionEliminar";
import DialogoModal from "../componentes/DialogoModal";
import deleteIcon from "../assets/iconos/eliminar.png";
import { useIdioma } from "../context/IdiomaContext";
import CartaEditor from "../componentes/CartaEditor";
import MenuEditor from "../componentes/MenuEditor";

function GestionarCarta() {

    const [tabActiva, setTabActiva] = useState("platos");

    const [platos, setPlatos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [nombreEn, setNombreEn] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [descripcionEn, setDescripcionEn] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState(null);
    const [editar, setEditar] = useState(false);
    const [platoAEliminar, setPlatoAEliminar] = useState(null);

    const [tipo, setTipo] = useState("");
    const [disponible, setDisponible] = useState(true);
    const [esNovedad, setEsNovedad] = useState(false);

    const [busqueda, setBusqueda] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const { t, idioma } = useIdioma();

    const nombrePlato = (p) => (idioma === "en" && p.nombreEn) ? p.nombreEn : p.nombre;
    const descPlato  = (p) => (idioma === "en" && p.descripcionEn) ? p.descripcionEn : p.descripcion;

    useEffect(() => {
        cargarPlatos();
    }, []);

    function cargarPlatos() {
        authFetch("/platos")
            .then(res => res.json())
            .then(data => setPlatos(data));
    }

    function limpiarFormularioPlato() {
        setId(null);
        setNombre("");
        setNombreEn("");
        setDescripcion("");
        setDescripcionEn("");
        setPrecio("");
        setImagen(null);
        setEditar(false);
        setTipo("");
        setDisponible(true);
        setEsNovedad(false);
    }

    function abrirFormularioCrear() {
        limpiarFormularioPlato();
        setMostrarFormulario(true);
    }

    function cerrarFormulario() {
        setMostrarFormulario(false);
        limpiarFormularioPlato();
    }

    function solicitarEliminarPlato(plato) {
        setPlatoAEliminar(plato);
        setMostrarConfirmacionEliminar(true);
    }

    function cancelarEliminarPlato() {
        setMostrarConfirmacionEliminar(false);
        setPlatoAEliminar(null);
    }

    function confirmarEliminarPlato() {

        if (!platoAEliminar) return;

        authFetch(`/platos/${platoAEliminar.id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    cargarPlatos();
                }
            })
            .finally(() => cancelarEliminarPlato());
    }

    function editarPlato(idPlato) {

        setEditar(true);

        authFetch(`/platos/${idPlato}`)
            .then(res => res.json())
            .then(data => {

                setId(idPlato);
                setNombre(data.nombre);
                setNombreEn(data.nombreEn || "");
                setDescripcion(data.descripcion);
                setDescripcionEn(data.descripcionEn || "");
                setPrecio(data.precio);
                setImagen(null);
                setTipo(data.tipo);
                setDisponible(data.disponible);
                setEsNovedad(data.esNovedad || false);

                setMostrarFormulario(true);
            });
    }

    function guardarPlato(e) {

        e.preventDefault();

        const formData = new FormData();

        formData.append("nombre", nombre);
        if (nombreEn) formData.append("nombreEn", nombreEn);
        formData.append("descripcion", descripcion);
        if (descripcionEn) formData.append("descripcionEn", descripcionEn);
        formData.append("precio", parseFloat(precio));
        formData.append("tipo", tipo);
        formData.append("disponible", disponible.toString());
        formData.append("esNovedad", esNovedad.toString());

        if (imagen) {
            formData.append("imagen", imagen);
        }

        if (id) {

            authFetch(`/platos/${id}`, {
                method: "PUT",
                body: formData
            }).then(() => {
                cargarPlatos();
                cerrarFormulario();
            });

        } else {

            authFetch("/platos/con-imagen", {
                method: "POST",
                body: formData
            }).then(() => {
                cargarPlatos();
                cerrarFormulario();
            });
        }
    }

    function toggleDisponible(id) {

        authFetch(`/platos/${id}/disponible`, {
            method: "PUT"
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al cambiar disponibilidad");
                return res.json();
            })
            .then(platoActualizado => {

                setPlatos(prev =>
                    prev.map(p =>
                        p.id === id ? platoActualizado : p
                    )
                );
            })
            .catch(err => console.error(err));
    }


    function tipoLabel(tipo) {
        const map = {
            PRIMERO: "carta.primero",
            SEGUNDO: "carta.segundo",
            TERCERO: "carta.tercero",
            POSTRE: "carta.postre",
            BEBIDA: "carta.bebida"
        };
        return map[tipo] ? t(map[tipo]) : tipo;
    }

    const platosFiltrados = platos.filter(plato => {
        const textoBusqueda = busqueda.toLowerCase();
        const coincideNombre =
            plato.nombre.toLowerCase().includes(textoBusqueda) ||
            (plato.nombreEn && plato.nombreEn.toLowerCase().includes(textoBusqueda));
        return coincideNombre && (filtroTipo === "" || plato.tipo === filtroTipo);
    });

    return (

        <div className="bg-gray-50 min-h-screen p-6">

            {/* TABS DE NAVEGACIÓN */}
            <div className="flex gap-1 mb-6 border-b border-gray-200">
                {[
                    { key: "platos", label: t("carta.tabPlatos") },
                    { key: "cartas", label: t("carta.tabCartas") },
                    { key: "menus", label: t("carta.tabMenus") },
                    { key: "qrs", label: t("carta.tabQRs") },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setTabActiva(tab.key)}
                        className={`px-5 py-2 text-sm rounded-t-lg transition
                            ${tabActiva === tab.key
                                ? "border border-b-white border-gray-200 bg-white text-emerald-700 font-medium -mb-px"
                                : "text-gray-500 hover:text-gray-700"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB: PLATOS Y BEBIDAS */}
            {tabActiva === "platos" && (
                <>
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                {/* BUSCADOR más el FILTRO */}
                <div className="flex gap-3 items-center p-4 border-b">

                    <input
                        type="text"
                        placeholder={t("carta.buscar")}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-gray-100 px-4 py-2 rounded-lg text-sm outline-none"
                    />

                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
                    >
                        <option value="">{t("carta.todosTipos")}</option>
                        <option value="PRIMERO">{t("carta.primero")}</option>
                        <option value="SEGUNDO">{t("carta.segundo")}</option>
                        <option value="POSTRE">{t("carta.postre")}</option>
                        <option value="BEBIDA">{t("carta.bebida")}</option>
                    </select>

                    <button
                        onClick={abrirFormularioCrear}
                        className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition"
                    >
                        {t("carta.añadirPlato")}
                    </button>

                </div>

                <table className="w-full text-sm">

                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left p-3">{t("carta.plato")}</th>
                            <th className="text-left p-3">{t("carta.descripcion")}</th>
                            <th className="text-left p-3">{t("carta.tipo")}</th>
                            <th className="text-left p-3">{t("carta.disponible")}</th>
                            <th className="text-left p-3">{t("carta.precio")}</th>
                            <th className="text-left p-3">{t("carta.acciones")}</th>
                        </tr>
                    </thead>

                    <tbody>

                        {platosFiltrados.map(plato => (

                            <tr key={plato.id} className="border-t hover:bg-gray-50">

                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={plato.imagen ? `/uploads/FotoPlatos/${plato.imagen}` : ""}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                        />
                                        <div>
                                            <span>{nombrePlato(plato)}</span>
                                            {plato.esNovedad && (
                                                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">{t("carta.novedad")}</span>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td className="p-3">{descPlato(plato)}</td>

                                <td className="p-3">{tipoLabel(plato.tipo)}</td>

                                <td className="p-3">
                                    <div
                                        onClick={() => toggleDisponible(plato.id)}
                                        className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer
                                        ${plato.disponible ? "bg-emerald-500" : "bg-gray-300"}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition
                                        ${plato.disponible ? "translate-x-5" : ""}`} />
                                    </div>
                                </td>

                                <td className="p-3">{plato.precio} €</td>

                                <td className="p-3">
                                    <div className="flex items-center gap-3">

                                        <button
                                            onClick={() => editarPlato(plato.id)}
                                            className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs hover:bg-emerald-200"
                                        >
                                            {t("editar")}
                                        </button>

                                        <button
                                            onClick={() => solicitarEliminarPlato(plato)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <img src={deleteIcon} className="w-5 h-5" />
                                        </button>

                                    </div>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <div className="p-4 text-xs text-gray-500 border-t">
                    {t("carta.mostrando")} {platosFiltrados.length} {t("carta.platos")}
                </div>

                </div>

                {/* MODAL */}
                <DialogoModal
                    abierto={mostrarFormulario}
                    onCerrar={cerrarFormulario}
                    titulo={editar ? t("carta.editarPlato") : t("carta.crearPlato")}
                >
                    <FormularioPlato
                        nombre={nombre}
                        nombreEn={nombreEn}
                        descripcion={descripcion}
                        descripcionEn={descripcionEn}
                        precio={precio}
                        tipo={tipo}
                        disponible={disponible}
                        esNovedad={esNovedad}
                        onNombreChange={(e) => setNombre(e.target.value)}
                        onNombreEnChange={(e) => setNombreEn(e.target.value)}
                        onDescripcionChange={(e) => setDescripcion(e.target.value)}
                        onDescripcionEnChange={(e) => setDescripcionEn(e.target.value)}
                        onPrecioChange={(e) => setPrecio(e.target.value)}
                        onTipoChange={(e) => { setTipo(e.target.value); if (e.target.value === "BEBIDA") setEsNovedad(false); }}
                        onDisponibleChange={(value) => setDisponible(value)}
                        onNovedad={(value) => setEsNovedad(value)}
                        onImagenChange={(e) => setImagen(e.target.files[0])}
                        onCancelar={cerrarFormulario}
                        onSubmit={guardarPlato}
                        editar={editar}
                    />
                </DialogoModal>

                <ConfirmacionEliminar
                    abierto={mostrarConfirmacionEliminar}
                    titulo={t("carta.eliminarPlato")}
                    mensaje={platoAEliminar ? `${t("carta.confirmarEliminar")} "${platoAEliminar.nombre}".` : ""}
                    onCancelar={cancelarEliminarPlato}
                    onConfirmar={confirmarEliminarPlato}
                />
                </>
            )}

            {/* TAB: CARTAS */}
            {tabActiva === "cartas" && <CartaEditor />}

            {tabActiva === "menus" && <MenuEditor />}

            {/* TAB: CÓDIGOS QR — placeholder */}
            {tabActiva === "qrs" && (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-400">
                    {t("carta.proximamente")}
                </div>
            )}

        </div>
    );
}

export default GestionarCarta;