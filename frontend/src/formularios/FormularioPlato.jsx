import { useState, useEffect } from "react";

function FormularioPlato({
    nombre,
    descripcion,
    precio,
    tipo,
    disponible,
    imagenActual,
    onNombreChange,
    onDescripcionChange,
    onPrecioChange,
    onTipoChange,
    onDisponibleChange,
    onImagenChange,
    onCancelar,
    onSubmit,
    editar
}) {

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

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre del plato..."
                    value={nombre}
                    onChange={onNombreChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
                <textarea
                    placeholder="Descripción del plato..."
                    value={descripcion}
                    onChange={onDescripcionChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                    rows={3}
                    required
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Precio (€)</label>
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
                    <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
                    <select
                        value={tipo}
                        onChange={onTipoChange}
                        className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                        required
                    >
                        <option value="">Seleccionar tipo</option>
                        <option value="PRIMERO">Primer plato</option>
                        <option value="SEGUNDO">Segundo plato</option>
                        <option value="POSTRE">Postre</option>
                        <option value="BEBIDA">Bebida</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">Disponible</label>
                <div
                    onClick={() => onDisponibleChange(!disponible)}
                    className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer transition
                        ${disponible ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full transition
                        ${disponible ? "translate-x-5" : ""}`} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Imagen</label>
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
                    <p className="text-sm text-gray-500 mb-1">Vista previa</p>
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
                    Cancelar
                </button>

                <button className="px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition">
                    Guardar
                </button>
            </div>

        </form>
    );
}

export default FormularioPlato;