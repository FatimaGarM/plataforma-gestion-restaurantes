import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";

function PantallaCamarero() {

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
      .then(data => setPedidos(data))
      .catch(() => {});
  }

  function servirPedido(id) {
    authFetch(`/pedidos/${id}/siguiente-estado`, { method: "PUT" })
      .then(res => res.json())
      .then(() => cargarPedidos())
      .catch(() => {});
  }

  const listos = pedidos.filter(p => p.estado === "Listo");
  const enCocina = pedidos.filter(p => p.estado === "Pendiente" || p.estado === "En proceso");

  // Agrupar pedidos listos por mesa
  const mesasListas = {};
  listos.forEach(p => {
    if (!mesasListas[p.mesa]) mesasListas[p.mesa] = [];
    mesasListas[p.mesa].push(p);
  });

  // Agrupar pedidos en cocina por mesa
  const mesasEnCocina = {};
  enCocina.forEach(p => {
    if (!mesasEnCocina[p.mesa]) mesasEnCocina[p.mesa] = [];
    mesasEnCocina[p.mesa].push(p);
  });

  return (
    <div className="container-page">

      <h1 className="title mb-6">{t("camarero.titulo")}</h1>

      {/* LISTOS PARA SERVIR */}
      <div className="mb-8">
        <h2 className="font-semibold text-green-700 text-lg mb-4">
          {t("camarero.listosParaServir")} ({listos.length})
        </h2>

        {listos.length === 0 && (
          <div className="card text-sm text-gray-400">{t("camarero.sinListos")}</div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(mesasListas).map(([mesa, pedidosMesa]) => (
            <div key={mesa} className="bg-green-50 rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Mesa {mesa}</h3>
              <div className="flex flex-col gap-2">
                {pedidosMesa.map(pedido => (
                  <div key={pedido.id} className="card">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{pedido.plato?.nombre}</p>
                      <span className="badge bg-green-100 text-green-700">{t("pedidos.estadoListo")}</span>
                    </div>
                    <button
                      className="btn btn-success mt-2 w-full text-xs"
                      onClick={() => servirPedido(pedido.id)}
                    >
                      {t("camarero.marcarServido")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EN COCINA */}
      <div>
        <h2 className="font-semibold text-gray-600 text-lg mb-4">
          {t("camarero.enCocina")} ({enCocina.length})
        </h2>

        {enCocina.length === 0 && (
          <div className="card text-sm text-gray-400">{t("camarero.sinEnCocina")}</div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(mesasEnCocina).map(([mesa, pedidosMesa]) => (
            <div key={mesa} className="bg-gray-50 rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Mesa {mesa}</h3>
              <div className="flex flex-col gap-2">
                {pedidosMesa.map(pedido => (
                  <div key={pedido.id} className="card">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{pedido.plato?.nombre}</p>
                      <span className={`badge ${
                        pedido.estado === "Pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {pedido.estado === "Pendiente" ? t("pedidos.estadoPendiente") : t("pedidos.enProceso")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default PantallaCamarero;
