import DialogoModal from "./DialogoModal";

function ConfirmacionEliminar({ abierto, titulo, mensaje, onCancelar, onConfirmar }) {
    return (
        <DialogoModal
            abierto={abierto}
            titulo={titulo}
            onCerrar={onCancelar}
            maxAncho="max-w-md"
        >

            {/* MENSAJE */}
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {mensaje}
            </p>

            {/* BOTONES */}
            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancelar}
                    className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    onClick={onConfirmar}
                    className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
                >
                    Eliminar
                </button>

            </div>

        </DialogoModal>
    );
}

export default ConfirmacionEliminar;