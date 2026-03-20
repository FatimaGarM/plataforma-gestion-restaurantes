function Inicio() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    return (
        <div className="space-y-6">

            {/* TÍTULO */}
            <div>
                <h1 className="text-2xl font-bold">
                    Bienvenido, {usuario?.nombre}
                </h1>
                <p className="text-gray-500">
                    Panel de control - {usuario?.tipoEmpleado}
                </p>
            </div>

            {/* TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Pedidos hoy</p>
                    <h2 className="text-2xl font-bold text-amber-600">24</h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Pedidos activos</p>
                    <h2 className="text-2xl font-bold text-amber-600">8</h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Mesas ocupadas</p>
                    <h2 className="text-2xl font-bold text-amber-600">12</h2>
                </div>

            </div>

            {/* BLOQUE SEGÚN ROL */}

            {usuario?.tipoEmpleado === "Gerente" && (
                <div className="bg-white p-5 rounded-xl shadow">
                    <h2 className="font-semibold mb-2">Resumen general</h2>
                    <p className="text-gray-500 text-sm">
                        Vista global del estado del restaurante
                    </p>
                </div>
            )}

            {usuario?.tipoEmpleado === "Camarero" && (
                <div className="bg-white p-5 rounded-xl shadow">
                    <h2 className="font-semibold mb-2">Tus mesas</h2>
                    <p className="text-gray-500 text-sm">
                        Gestiona pedidos y estado de las mesas
                    </p>
                </div>
            )}

            {usuario?.tipoEmpleado === "Cocinero" && (
                <div className="bg-white p-5 rounded-xl shadow">
                    <h2 className="font-semibold mb-2">Cocina</h2>
                    <p className="text-gray-500 text-sm">
                        Control de pedidos en preparación
                    </p>
                </div>
            )}

        </div>
    );
}

export default Inicio;