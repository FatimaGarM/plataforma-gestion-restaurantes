import { useEffect, useState } from "react";

function PantallaCocina() {

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    cargarPedidos();
    const intervalo = setInterval(cargarPedidos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  function cargarPedidos() {
    fetch("/pedidos/activos")
      .then(res => res.json())
<<<<<<< HEAD
      .then(data => setPedidos(data))
=======
      .then(data => {
        setPedidos(data);
      })
>>>>>>> origin/luis2
      .catch(() => {});
  }

  function avanzarEstado(id) {
    fetch(`/pedidos/${id}/siguiente-estado`, { method: "PUT" })
      .then(res => res.json())
      .then(() => cargarPedidos())
      .catch(() => {});
  }

  const pendientes = pedidos.filter(p => p.estado === "Pendiente");
<<<<<<< HEAD
  const enProceso = pedidos.filter(p => p.estado === "EnProceso");
=======
  const enProceso = pedidos.filter(p => p.estado === "En proceso");
>>>>>>> origin/luis2

  return (
    <div className="container-page">

      <h1 className="title mb-6">Cocina</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* PENDIENTES */}
        <div className="bg-yellow-50 rounded-xl border p-5">
          <h2 className="font-semibold text-yellow-700 mb-4">
            Pendientes ({pendientes.length})
          </h2>

          {pendientes.length === 0 && (
            <p className="text-sm text-gray-400">Sin pedidos pendientes</p>
          )}

          <div className="flex flex-col gap-3">
            {pendientes.map(pedido => (
              <div key={pedido.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Mesa {pedido.mesa}</p>
                    <p className="text-sm text-gray-500">{pedido.plato?.nombre}</p>
                  </div>
                  <span className="badge bg-yellow-100 text-yellow-700">Pendiente</span>
                </div>
                <button
                  className="btn btn-primary mt-3 w-full"
                  onClick={() => avanzarEstado(pedido.id)}
                >
                  Empezar a preparar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* EN PROCESO */}
        <div className="bg-blue-50 rounded-xl border p-5">
          <h2 className="font-semibold text-blue-700 mb-4">
<<<<<<< HEAD
            En proceso ({enProceso.length})
=======
            En Proceso ({enProceso.length})
>>>>>>> origin/luis2
          </h2>

          {enProceso.length === 0 && (
            <p className="text-sm text-gray-400">Nada en preparación</p>
          )}

          <div className="flex flex-col gap-3">
            {enProceso.map(pedido => (
              <div key={pedido.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Mesa {pedido.mesa}</p>
                    <p className="text-sm text-gray-500">{pedido.plato?.nombre}</p>
                  </div>
                  <span className="badge bg-blue-100 text-blue-700">En proceso</span>
                </div>
                <button
                  className="btn btn-success mt-3 w-full"
                  onClick={() => avanzarEstado(pedido.id)}
                >
                  Marcar como listo
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default PantallaCocina;
