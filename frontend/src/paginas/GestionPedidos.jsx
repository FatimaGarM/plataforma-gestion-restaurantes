import { useEffect, useState } from "react";

function GestionPedidos() {

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    cargarPedidos();

    // refresco automático cada 5s
    const intervalo = setInterval(cargarPedidos, 5000);
    return () => clearInterval(intervalo);

  }, []);

  function cargarPedidos() {
    fetch("/pedidos/activos")
      .then(res => res.json())
      .then(data => setPedidos(data));
  }

  function cambiarEstado(id) {

    fetch(`/pedidos/${id}/siguiente-estado`, {
      method: "PUT"
    })
      .then(res => res.json())
      .then(() => cargarPedidos());
  }

  function colorEstado(estado) {
    if (estado === "Pendiente") return "bg-yellow-100 text-yellow-700";
    if (estado === "EnProceso") return "bg-blue-100 text-blue-700";
    if (estado === "Listo") return "bg-green-100 text-green-700";
    if (estado === "Servido") return "bg-gray-300 text-gray-700";
    return "";
  }

  function siguienteEstado(estado) {
    if (estado === "Pendiente") return "EnProceso";
    if (estado === "EnProceso") return "Listo";
    if (estado === "Listo") return "Servido";
    return null;
  }

  return (
    <div className="container-page">

      <h1 className="title mb-6">Gestión de Pedidos</h1>

      <div className="grid md:grid-cols-3 gap-4">

        {/* PENDIENTES */}
        <ColumnaPedidos
          titulo="Pendientes"
          pedidos={pedidos.filter(p => p.estado === "Pendiente")}
          color="bg-yellow-50"
          onAccion={cambiarEstado}
          siguienteEstado={siguienteEstado}
          colorEstado={colorEstado}
        />

        {/* EN PROCESO */}
        <ColumnaPedidos
          titulo="En proceso"
          pedidos={pedidos.filter(p => p.estado === "EnProceso")}
          color="bg-blue-50"
          onAccion={cambiarEstado}
          siguienteEstado={siguienteEstado}
          colorEstado={colorEstado}
        />

        {/* LISTOS */}
        <ColumnaPedidos
          titulo="Listos"
          pedidos={pedidos.filter(p => p.estado === "Listo")}
          color="bg-green-50"
          onAccion={cambiarEstado}
          siguienteEstado={siguienteEstado}
          colorEstado={colorEstado}
        />

      </div>

    </div>
  );
}

export default GestionPedidos;



// ================= COMPONENTE COLUMNA =================

function ColumnaPedidos({ titulo, pedidos, color, onAccion, siguienteEstado, colorEstado }) {

  return (
    <div className={`p-4 rounded-xl border ${color}`}>

      <h2 className="font-semibold mb-4">{titulo}</h2>

      {pedidos.length === 0 && (
        <p className="text-sm text-gray-400">Sin pedidos</p>
      )}

      <div className="flex flex-col gap-3">

        {pedidos.map(pedido => (

          <div key={pedido.id} className="card">

            <p className="font-medium">
              Mesa {pedido.mesa}
            </p>

            <p className="text-sm text-gray-500">
              {pedido.plato?.nombre}
            </p>

            <span className={`badge ${colorEstado(pedido.estado)}`}>
              {pedido.estado}
            </span>

            {siguienteEstado(pedido.estado) && (
              <button
                className="btn btn-success mt-2"
                onClick={() => onAccion(pedido.id)}
              >
                Pasar a {siguienteEstado(pedido.estado)}
              </button>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}