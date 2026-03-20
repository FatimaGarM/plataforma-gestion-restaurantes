import { useState } from "react";

function FormularioPlato({
    nombre,
    descripcion,
    precio,
    tipo,
    disponible,
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

    function manejarImagen(e) {
        const archivo = e.target.files[0];
        if (!archivo) return;

        setPreview(URL.createObjectURL(archivo));
        onImagenChange(e);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex gap-2 flex-wrap"
        >

            {/* NOMBRE */}
            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={onNombreChange}
                className="border p-2 flex-1 min-w-[180px]"
                required
            />

            {/* DESCRIPCIÓN */}
            <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={onDescripcionChange}
                className="border p-2 flex-1 min-w-[180px]"
                required
            />

            {/* PRECIO */}
            <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={precio}
                onChange={onPrecioChange}
                className="border p-2 w-full sm:w-40"
                required
                min="0"
            />

            {/* TIPO */}
            <select
                value={tipo}
                onChange={onTipoChange}
                className="border p-2 w-full sm:w-40"
                required
            >
                <option value="">Tipo</option>
                <option value="PRIMERO">Primer plato</option>
                <option value="SEGUNDO">Segundo plato</option>
                <option value="TERCERO">Tercer plato</option>
                <option value="POSTRE">Postre</option>
                <option value="BEBIDA">Bebida</option>
            </select>

            {/* DISPONIBLE */}
            <div className="flex items-center gap-2 w-full sm:w-40">
                <label className="text-sm">Disponible</label>
                <input
                    type="checkbox"
                    checked={disponible}
                    onChange={(e) => onDisponibleChange(e.target.checked)}
                />
            </div>

            {/* IMAGEN */}
            <input
                type="file"
                onChange={manejarImagen}
                className="border p-2 w-full"
                accept="image/*"
                required={!editar}
            />

            {/* PREVIEW */}
            {preview && (
                <div className="w-full mt-2">
                    <p className="text-sm text-gray-500 mb-1">
                        Vista previa de la imagen
                    </p>

                    <img
                        src={preview}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded border"
                    />
                </div>
            )}

            {/* BOTONES */}
            <div className="w-full flex justify-end gap-2 mt-2">

                <button
                    type="button"
                    className="bg-gray-300 text-black px-3 py-2"
                    onClick={onCancelar}
                >
                    Cancelar
                </button>

                <button className="bg-orange-400 text-white px-3 py-2">
                    Guardar
                </button>

            </div>

        </form>
    );
}

export default FormularioPlato;