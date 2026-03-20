function DialogoModal({ abierto, titulo, onCerrar, children, maxAncho = "max-w-2xl" }) {
    if (!abierto) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onCerrar}
        >
            <div
                className={`bg-white w-full ${maxAncho} rounded-lg shadow-xl p-6`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{titulo}</h2>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 text-xl"
                        onClick={onCerrar}
                    >
                        ✕
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

export default DialogoModal;
