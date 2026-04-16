import { useState, useEffect } from "react";
import { useIdioma } from "../context/IdiomaContext";

function FormularioPlato({
    nombre,
    nombreEn,
    descripcion,
    descripcionEn,
    precio,
    tipo,
    disponible,
    esNovedad,
    imagenActual,
    onNombreChange,
    onNombreEnChange,
    onDescripcionChange,
    onDescripcionEnChange,
    onPrecioChange,
    onTipoChange,
    onDisponibleChange,
    onNovedad,
    onImagenChange,
    onCancelar,
    onSubmit,
    editar
}) {

    const { t } = useIdioma();

    const [preview, setPreview] = useState(null);

    // cargar imagen existente
    useEffect(() => {
        if (editar && imagenActual) {
            setPreview(`http://localhost:8080/uploads/FotoPlatos/${imagenActual}`);
        }
    }, [editar, imagenActual]);

    function manejarImagen(e) {
        const archivo = e.target.files[0];
        if (!archivo) return;

        setPreview(URL.createObjectURL(archivo));
        onImagenChange(e);
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">

            {/* NOMBRE */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("carta.plato")}</p>
                <label className="block text-xs text-gray-500 mb-1">{t("config.español")}</label>
                <input
                    type="text"
                    placeholder={t("plato.nombreEs")}
                    value={nombre}
                    onChange={onNombreChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 mb-2"
                    required
                />
                <label className="block text-xs text-gray-500 mb-1">{t("config.ingles")}</label>
                <input
                    type="text"
                    placeholder={t("plato.nombreEn")}
                    value={nombreEn}
                    onChange={onNombreEnChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                />
            </div>

            {/* DESCRIPCIÓN */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("carta.descripcion")}</p>
                <label className="block text-xs text-gray-500 mb-1">{t("config.español")}</label>
                <textarea
                    placeholder={t("plato.descripcionEs")}
                    value={descripcion}
                    onChange={onDescripcionChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 resize-none mb-2"
                    rows={2}
                    required
                />
                <label className="block text-xs text-gray-500 mb-1">{t("config.ingles")}</label>
                <textarea
                    placeholder={t("plato.descripcionEn")}
                    value={descripcionEn}
                    onChange={onDescripcionEnChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                    rows={2}
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t("carta.precio")} (€)</label>
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

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t("carta.tipo")}</label>
                    <select
                        value={tipo}
                        onChange={onTipoChange}
                        className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                        required
                    >
                        <option value="">{t("carta.seleccionarTipo")}</option>
                        <option value="PRIMERO">{t("carta.primero")}</option>
                        <option value="SEGUNDO">{t("carta.segundo")}</option>
                        <option value="POSTRE">{t("carta.postre")}</option>
                        <option value="BEBIDA">{t("carta.bebida")}</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">{t("carta.disponible")}</label>
                <div
                    onClick={() => onDisponibleChange(!disponible)}
                    className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer transition
                        ${disponible ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full transition
                        ${disponible ? "translate-x-5" : ""}`} />
                </div>
            </div>

            <div className={`flex items-center gap-3 ${tipo === "BEBIDA" ? "opacity-40 pointer-events-none" : ""}`}>
                <label className="text-sm font-medium text-gray-600">{t("carta.novedad")}</label>
                <div
                    onClick={() => onNovedad && onNovedad(!esNovedad)}
                    className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer transition
                        ${esNovedad ? "bg-amber-400" : "bg-gray-300"}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full transition
                        ${esNovedad ? "translate-x-5" : ""}`} />
                </div>
                {esNovedad && <span className="text-xs text-amber-600 font-medium">{t("carta.novedad")}</span>}
                {tipo === "BEBIDA" && <span className="text-xs text-gray-400">{t("carta.novedadNoBebida")}</span>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">{t("plato.imagen")}</label>
                <input
                    type="file"
                    onChange={manejarImagen}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    accept="image/*"
                    required={!editar}
                />
            </div>

            {preview && (
                <div>
                    <p className="text-sm text-gray-500 mb-1">{t("plato.vistaPrevia")}</p>
                    <img
                        src={preview}
                        className="w-32 h-32 object-cover rounded-lg border"
                    />
                </div>
            )}

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

export default FormularioPlato;