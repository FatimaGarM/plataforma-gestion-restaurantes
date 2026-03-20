import { useState } from "react";

function FormularioEmpleado({
    nombre,
    email,
    contraseña,
    tipoEmpleado,
    onNombreChange,
    onEmailChange,
    onContraseñaChange,
    onTipoEmpleadoChange,
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

            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={onNombreChange}
                className="border p-2 flex-1 min-w-[180px]"
                required
            />

            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={onEmailChange}
                className="border p-2 flex-1 min-w-[180px]"
                required
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={onContraseñaChange}
                className="border p-2 w-full sm:w-40"
                required
                min="0"
            />

                <input
                type="text"
                placeholder="Tipo de empleado"
                value={tipoEmpleado}
                onChange={onTipoEmpleadoChange}
                className="border p-2 w-full sm:w-40"
                required
            />

            <input
                type="file"
                onChange={manejarImagen}
                className="border p-2 w-full"
                accept="image/*"
                required={!editar}
            />

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

export default FormularioEmpleado;