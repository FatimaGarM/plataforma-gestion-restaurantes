import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";

function GestionPedidos() {

  const [pedidos, setPedidos] = useState([]);
  const { t } = useIdioma();

  useEffect(() => {
    cargarPedidos();
    const intervalo = setInterval(cargarPedidos, 5000);
    return () => clearInterval(intervalo);

  }, []);

  function cargarPedidos() {
    authFetch("/pedidos/activos")
      .then(res => res.json())
      .then(data => setPedidos(data));
  }

  function cambiarEstado(id) {

    authFetch(`/pedidos/${id}/siguiente-estado`, {
      method: "PUT"
    }).then(() => {
      cargarPedidos();
    });

  }

  function colorEstado(estado) {
    if (estado === "Pendiente") return "bg-yellow-100 text-yellow-700";
    if (estado === "En proceso") return "bg-blue-100 text-blue-700";
    if (estado === "Listo") return "bg-green-100 text-green-700";
    if (estado === "Servido") return "bg-gray-300 text-gray-700";
    return "";
  }

  function siguienteEstado(estado) {
    if (estado === "Pendiente") return "En proceso";
    if (estado === "En proceso") return "Listo";
    if (estado === "Listo") return "Servido";
    return null;
  }

  return (
    <div className="container-page">

      <h1 className="title mb-6">{t("pedidos.titulo")}</h1>

      <div className="grid md:grid-cols-3 gap-4">

        {/* PENDIENTES */}
        <ColumnaPedidos
          titulo={t("pedidos.pendientes")}
          pedidos={pedidos.filter(p => p.estado === "Pendiente")}
          color="bg-yellow-50"
          onAccion={cambiarEstado}
          siguienteEstado={siguienteEstado}
          colorEstado={colorEstado}
          t={t}
        />

        {/* EN PROCESO */}
        <ColumnaPedidos
          titulo={t("pedidos.enProceso")}
          pedidos={pedidos.filter(p => p.estado === "En proceso")}
          color="bg-blue-50"
          onAccion={cambiarEstado}
          siguienteEstado={siguienteEstado}
          colorEstado={colorEstado}
          t={t}
        />

        {/* LISTOS */}
        <ColumnaPedidos
          titulo={t("pedidos.listos")}
          pedidos={pedidos.filter(p => p.estado === "Listo")}
          color="bg-green-50"
          onAccion={cambiarEstado}
          siguienteEstado={siguienteEstado}
          colorEstado={colorEstado}
          t={t}
        />

      </div>

    </div>
  );
}

export default GestionPedidos;



// ================= COMPONENTE COLUMNA =================

function ColumnaPedidos({ titulo, pedidos, color, onAccion, siguienteEstado, colorEstado, t }) {

  const estadoBadge = {
    "Pendiente": t("pedidos.estadoPendiente"),
    "En proceso": t("pedidos.enProceso"),
    "Listo": t("pedidos.estadoListo"),
    "Servido": t("pedidos.servido"),
  };

  function accionLabel(estado) {
    if (estado === "Pendiente") return t("pedidos.iniciarPreparacion");
    if (estado === "En proceso") return t("pedidos.marcarListo");
    if (estado === "Listo") return t("pedidos.marcarServido");
    return "";
  }

  return (
    <div className={`p-4 rounded-xl border ${color}`}>

      <h2 className="font-semibold mb-4">{titulo}</h2>

      {pedidos.length === 0 && (
        <p className="text-sm text-gray-400">{t("cocina.sinPendientes")}</p>
      )}

      <div className="flex flex-col gap-3">

        {pedidos.map(pedido => (

          <div key={pedido.id} className="card">

            <p className="font-medium">
              {t("pedidos.mesa")} {pedido.mesa}
            </p>

            <p className="text-sm text-gray-500">
              {pedido.plato?.nombre}
            </p>

            <span className={`badge ${colorEstado(pedido.estado)}`}>
              {estadoBadge[pedido.estado] || pedido.estado}
            </span>

            {siguienteEstado(pedido.estado) && (
              <button
                className="btn btn-success mt-2"
                onClick={() => onAccion(pedido.id)}
              >
                {accionLabel(pedido.estado)}
              </button>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}