import { useState } from "react";

function FormularioEmpleado({
    nombre,
    email,
    contraseña,
    tipoEmpleado,
    estado,
    onNombreChange,
    onEmailChange,
    onContraseñaChange,
    onTipoChange,
    onEstadoChange,
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
        <form onSubmit={onSubmit} className="flex flex-col gap-3">

            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={onNombreChange}
                className="input"
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={onEmailChange}
                className="input"
                required
            />

            {!editar && (
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={onContraseñaChange}
                    className="input"
                    required
                />
            )}

            <select
                value={tipoEmpleado}
                onChange={onTipoChange}
                className="input"
                required
            >
                <option value="">Seleccionar rol</option>
                <option value="Camarero">Camarero</option>
                <option value="Cocinero">Cocinero</option>
                <option value="Gerente">Gerente</option>
            </select>

            <select
                value={estado}
                onChange={onEstadoChange}
                className="input"
                required
            >
                <option value="">Seleccionar estado</option>
                <option value="Activo">Activo</option>
                <option value="Descanso">Descanso</option>
                <option value="Vacaciones">Vacaciones</option>
            </select>

            <input
                type="file"
                onChange={manejarImagen}
                className="input"
                accept="image/*"
            />

            {preview && (
                <img
                    src={preview}
                    className="w-24 h-24 object-cover rounded-lg"
                />
            )}

            <div className="flex justify-end gap-2 mt-2">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="btn btn-outline"
                >
                    Cancelar
                </button>

                <button className="btn btn-success">
                    Guardar
                </button>
            </div>

        </form>
    );
}

export default FormularioEmpleado;