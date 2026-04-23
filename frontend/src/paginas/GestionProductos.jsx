import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import FormularioProducto from "../formularios/FormularioProducto";
import FormularioProveedor from "../formularios/FormularioProveedor";
import ConfirmacionEliminar from "../componentes/ConfirmacionEliminar";
import DialogoModal from "../componentes/DialogoModal";
import deleteIcon from "../assets/iconos/eliminar.png";
import { useIdioma } from "../context/IdiomaContext";
import CartaEditor from "../componentes/CartaEditor";
import MenuEditor from "../componentes/MenuEditor";

function GestionProductos() {


    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [proveedorEditar, setProveedorEditar] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
    const [mostrarFormularioProveedor, setMostrarFormularioProveedor] = useState(false);

    const [id, setId] = useState(null);
    const [nombreProducto, setNombreProducto] = useState("");
    const [descripcionProducto, setDescripcionProducto] = useState("");
    const [proveedorId, setProveedorId] = useState([]);
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState(0);
    const [idProveedor, setIdProveedor] = useState(null);
    const [nombreProveedor, setNombreProveedor] = useState("");
    const [telefonoProveedor, setTelefonoProveedor] = useState("");
    const [emailProveedor, setEmailProveedor] = useState("");

    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productoEditar, setProductoEditar] = useState(false);

    const [disponible, setDisponible] = useState(true);
    const [esNovedad, setEsNovedad] = useState(false);

    const [busqueda, setBusqueda] = useState("");
    const { t, idioma } = useIdioma();


    useEffect(() => {
        cargarProductos();
        cargarProveedores();
    }, []);

    useEffect(() => {
        if (proveedorEditar != null) editarProveedor();
    }, [proveedorEditar]);

    function cargarProveedores() {
        authFetch("/proveedores")
            .then(res => res.json())
            .then(data => setProveedores(data));
    }

    function cargarProductos() {
        authFetch("/productos")
            .then(res => res.json())
            .then(data => setProductos(data));
    }

    function limpiarFormularioProducto() {
        setId(null);
        setNombreProducto("");
        setDescripcionProducto("");
        setPrecio("");
        setStock(0);
        setProductoEditar(null);
    }

    function abrirFormularioCrear() {
        limpiarFormularioProducto();
        setMostrarFormulario(true);
    }

    function abrirFormularioEditar() {
        setMostrarFormulario(true);
    }

    function cerrarFormulario() {
        setMostrarFormulario(false);
        limpiarFormularioProducto();
    }

    function solicitarEliminarProducto(productoId) {
        setProductoAEliminar(productoId);
        setMostrarConfirmacionEliminar(true);
    }

    function cancelarEliminarProducto() {
        setMostrarConfirmacionEliminar(false);
        setProductoAEliminar(null);
    }

    function limpiarFormularioProveedor() {
        setIdProveedor(null);
        setNombreProveedor("");
        setTelefonoProveedor("");
        setEmailProveedor("");
    }

    function abrirFormularioCrearProveedor() {
        limpiarFormularioProveedor();
        setMostrarFormularioProveedor(true);
    }
    function abrirFormularioEditarProveedor() {
        const proveedorEnEdicion = proveedores.find(p => p.id === parseInt(proveedorEditar));
        setIdProveedor(proveedorEnEdicion.id);
        setNombreProveedor(proveedorEnEdicion.nombre);
        setTelefonoProveedor(proveedorEnEdicion.telefono);
        setEmailProveedor(proveedorEnEdicion.email);
        setMostrarFormularioProveedor(true);
    }

    function cerrarFormularioProveedor() {
        setMostrarFormularioProveedor(false);
        limpiarFormularioProveedor();
    }

    function editarProveedor() {
        abrirFormularioEditarProveedor();
    }

    function confirmarEliminarProducto() {

        if (!productoAEliminar) return;

        authFetch(`/productos/${productoAEliminar}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    cargarProductos();
                }
            })
            .finally(() => cancelarEliminarProducto());
    }

    function editarProducto(idProducto) {

        const producto = productos.find(p => p.id === idProducto);

        setNombreProducto(producto.nombre);
        setDescripcionProducto(producto.descripcion);
        setPrecio(producto.precio);
        setStock(producto.stock);

        const proveedor = proveedores.filter(p => p.productos.some(prod => prod.id === producto.id));
        setProveedorId(proveedor[0]?.id);

        setProductoEditar(idProducto);
        setMostrarFormulario(true);
    }

    function guardarProducto() {


        const producto = {
            nombre: nombreProducto,
            descripcion: descripcionProducto,
            precio: parseFloat(precio),
            stock: stock,
            proveedor: {
                id: proveedorId
            }
        };


        if (productoEditar != null) {

            authFetch(`/productos/${productoEditar}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(producto)
            }).then(() => {
                cargarProductos();
                cerrarFormulario();
            });

        } else {

            authFetch("/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(producto)
            }).then(() => {
                cargarProductos();
                cerrarFormulario();
            });
        }
    }
    function guardarProveedor() {


        const proveedor = {
            nombre: nombreProveedor,
            email: emailProveedor,
            telefono: telefonoProveedor
        };

        if (proveedorEditar != null) {

            authFetch(`/proveedores/${proveedorEditar}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(proveedor)
            }).then(() => {
                cargarProveedores();
                cerrarFormularioProveedor();
            });

        } else {

            authFetch("/proveedores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(proveedor)
            }).then(() => {
                cargarProveedores();
                cerrarFormularioProveedor();
            });
        }
    }

    function eliminarProveedor(idProveedor) {

        authFetch(`/proveedores/${idProveedor}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    cargarProveedores();
                }
            }).finally(() => {
                setProveedorEditar(null);
            });
    }

    function cambiarStock(idProducto, nuevoStock) {

        authFetch(`/productos/${idProducto}/cambiar-stock`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nuevoStock })
        }).then(() => {
            cargarProductos();
        });
    }

    const productosFiltrados = productos.filter(producto => {
        const textoBusqueda = busqueda.toLowerCase();
        const coincideNombre = producto.nombre.toLowerCase().includes(textoBusqueda);
        return coincideNombre;
    });

    return (

        <div className="bg-gray-50 min-h-screen p-6">

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                {/* BUSCADOR más el FILTRO */}
                <div className="flex gap-3 items-center p-4 border-b">

                    <input
                        type="text"
                        placeholder={t("productos.buscar")}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-gray-100 px-4 py-2 rounded-lg text-sm outline-none"
                    />

                    <button
                        onClick={abrirFormularioCrear}
                        className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition"
                    >
                        {t("productos.añadirProducto")}
                    </button>

                    <button
                        onClick={abrirFormularioCrearProveedor}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition"
                    >
                        {t("proveedores.añadirProveedor")}
                    </button>
                    <div className="ml-4">
                        <div className="flex items-center gap-2 mt-1">
                            <select
                                value={proveedorEditar || ""}
                                onChange={(e) => setProveedorEditar(e.target.value)}
                                className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm pr-8 appearance-none"
                            >
                                <option value="">{t("proveedores.editar")}</option>
                                {proveedores.map(proveedor => (
                                    <option key={proveedor.id} value={proveedor.id}>
                                        {proveedor.nombre}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => eliminarProveedor(proveedorEditar)}
                                className="text-red-500 hover:text-red-600"
                            >
                                <img src={deleteIcon} className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                </div>

                <table className="w-full text-sm">

                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left p-3">{t("productos.nombre")}</th>
                            <th className="text-left p-3">{t("productos.stock")}</th>
                            <th className="text-left p-3">{t("productos.proveedor")}</th>
                            <th className="text-left p-3">{t("productos.acciones")}</th>
                        </tr>
                    </thead>

                    <tbody>

                        {productosFiltrados.map(producto => (

                            <tr key={producto.id} className="border-t hover:bg-gray-50">

                                <td className="p-3">
                                    <p className="font-medium">{producto.nombre}</p>
                                    <p className="text-sm text-gray-500">{producto.descripcion}</p>
                                    <p className="text-sm text-gray-600 mt-1">{t("productos.precio")}: {producto.precio.toFixed(2)} € / kg</p>
                                </td>

                                <td className="p-3">
                                    <button
                                        onClick={() => { cambiarStock(producto.id, producto.stock - 1) }}
                                        className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200"
                                    >
                                        -
                                    </button>
                                    <span className="px-2">{producto.stock}</span>
                                    <button
                                        onClick={() => { cambiarStock(producto.id, producto.stock + 1) }}
                                        className="px-2 py-1 bg-green-100 text-green-600 rounded-lg text-xs hover:bg-green-200"
                                    >
                                        +
                                    </button>
                                </td>

                                <td className="p-3">
                                    {proveedores.filter(p => p.productos.some(prod => prod.id === producto.id)).map(p => (
                                        <div key={p.id}>
                                            <span className="text-sm text-gray-600 block">{p.nombre}</span>
                                            <span className="text-sm text-gray-600 block">{p.email}</span>
                                            <span className="text-sm text-gray-600 block">{p.telefono}</span>
                                        </div>
                                    ))}
                                </td>

                                <td className="p-3">
                                    <div className="flex items-center gap-3">

                                        <button
                                            onClick={() => editarProducto(producto.id)}
                                            className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs hover:bg-emerald-200"
                                        >
                                            {t("editar")}
                                        </button>

                                        <button
                                            onClick={() => solicitarEliminarProducto(producto.id)}
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
                    {t("productos.mostrando")} {productosFiltrados.length} {t("productos.productos")}
                </div>

            </div>

            {/* MODAL */}
            <DialogoModal
                abierto={mostrarFormulario}
                onCerrar={cerrarFormulario}
                titulo={productoEditar ? t("productos.editarProducto") : t("productos.crearProducto")}
            >
                <FormularioProducto
                    nombre={nombreProducto}
                    descripcion={descripcionProducto}
                    precio={precio}
                    stock={stock}
                    proveedor={proveedorId}
                    onNombreChange={(e) => setNombreProducto(e.target.value)}
                    onDescripcionChange={(e) => setDescripcionProducto(e.target.value)}
                    onPrecioChange={(e) => setPrecio(e.target.value)}
                    onStockChange={(e) => setStock(e.target.value)}
                    onProveedorChange={(e) => setProveedorId(e.target.value)}
                    onCancelar={cerrarFormulario}
                    onSubmit={guardarProducto}
                />
            </DialogoModal>

            {/*MODAL PROVEEDORES*/}
            <DialogoModal
                abierto={mostrarFormularioProveedor}
                onCerrar={cerrarFormularioProveedor}
                titulo={proveedorEditar ? t("proveedores.editarProveedor") : t("proveedores.crearProveedor")}
            >
                <FormularioProveedor
                    nombre={nombreProveedor}
                    email={emailProveedor}
                    telefono={telefonoProveedor}
                    onNombreChange={(e) => setNombreProveedor(e.target.value)}
                    onTelefonoChange={(e) => setTelefonoProveedor(e.target.value)}
                    onEmailChange={(e) => setEmailProveedor(e.target.value)}
                    onCancelar={cerrarFormularioProveedor}
                    onSubmit={guardarProveedor}
                />
            </DialogoModal>

            <ConfirmacionEliminar
                abierto={mostrarConfirmacionEliminar}
                titulo={t("productos.eliminarProducto")}
                mensaje={productoAEliminar ? `${t("productos.confirmarEliminar")} "${productos.find(p => p.id === productoAEliminar)?.nombre}".` : ""}
                onCancelar={cancelarEliminarProducto}
                onConfirmar={confirmarEliminarProducto}
            />
        </div>
    );
}

export default GestionProductos;