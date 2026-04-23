import { useState, useEffect } from "react";
import { useIdioma } from "../context/IdiomaContext";
import { authFetch } from "../utils/authFetch";

function FormularioProducto({
    nombre,
    descripcion,
    precio,
    stock,
    proveedor,
    onNombreChange,
    onDescripcionChange,
    onPrecioChange,
    onStockChange,
    onProveedorChange,
    onCancelar,
    onSubmit
}) {

    const { t } = useIdioma();

    
    const [ proveedores, setProveedores] = useState([]);

    useEffect(() => {
        authFetch("/proveedores")
            .then(res => res.json())
            .then(data => setProveedores(data))
            .catch(() => {});
    }, []);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">

            {/* NOMBRE */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("productos.producto")}</p>
                <input
                    type="text"
                    placeholder={t("productos.nombre")}
                    value={nombre}
                    onChange={onNombreChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 mb-2"
                    required
                />
            </div>

            {/* DESCRIPCIÓN */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("productos.descripcion")}</p>
                <textarea
                    placeholder={t("producto.descripcion")}
                    value={descripcion}
                    onChange={onDescripcionChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 resize-none mb-2"
                    rows={2}
                    required
                />
                <label className="block text-xs text-gray-500 mb-1">{t("config.ingles")}</label>
            </div>

            {/* PRECIO */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t("productos.precio")} (€ / kg)</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={precio}
                        onChange={onPrecioChange}
                        className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                        required
                        min="0"
                    />
            </div>

            {/* STOCK */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("productos.stock")}</p>
                <input
                    type="number"
                    placeholder={t("productos.stock")}
                    value={stock}
                    onChange={onStockChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                    required
                    min="0"
                />
            </div>

            {/* PROVEEDOR */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("productos.proveedor")}</p>
                <select
                    value={proveedor}
                    onChange={onProveedorChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 mb-2"
                    required
                >
                    <option value="">{t("productos.seleccionar.proveedor")}</option>
                    {proveedores.map(proveedor => (
                        <option key={proveedor.id} value={proveedor.id}>
                            {proveedor.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="px-4 py-2 rounded-lg text-sm border text-gray-600 hover:bg-gray-100 transition"
                >
                    {t("cancelar")}
                </button>

                <button className="px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition">
                    {t("guardar")}
                </button>
            </div>

        </form>
    );
}

export default FormularioProducto;