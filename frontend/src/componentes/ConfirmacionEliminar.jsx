import DialogoModal from "./DialogoModal";

function ConfirmacionEliminar({ abierto, titulo, mensaje, onCancelar, onConfirmar }) {
    return (
        <DialogoModal
            abierto={abierto}
            titulo={titulo}
            onCerrar={onCancelar}
            maxAncho="max-w-md"
        >
            <p className="text-gray-700 mb-5">{mensaje}</p>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className="bg-gray-300 text-black px-3 py-2"
                    onClick={onCancelar}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    className="bg-red-600 text-white px-3 py-2"
                    onClick={onConfirmar}
                >
                    Eliminar
                </button>
            </div>
        </DialogoModal>
    );
}

export default ConfirmacionEliminar;

