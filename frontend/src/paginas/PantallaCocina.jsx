import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";

function PantallaCocina() {

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
      .then(data => {
        setPedidos(data);
      })
      .catch(() => {});
  }

  function avanzarEstado(id) {
    authFetch(`/pedidos/${id}/siguiente-estado`, { method: "PUT" })
      .then(res => {
        if (!res.ok) return res.text().then(msg => { throw new Error(msg); });
        return res.json();
      })
      .then(() => cargarPedidos())
      .catch(err => alert("Error al cambiar estado: " + err.message));
  }

  const pendientes = pedidos.filter(p => p.estado === "Pendiente");
  const enProceso = pedidos.filter(p => p.estado === "En proceso");

  return (
    <div className="container-page">

      <h1 className="title mb-6">{t("cocina.titulo")}</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* PENDIENTES */}
        <div className="bg-yellow-50 rounded-xl border p-5">
          <h2 className="font-semibold text-yellow-700 mb-4">
            {t("pedidos.pendientes")} ({pendientes.length})
          </h2>

          {pendientes.length === 0 && (
            <p className="text-sm text-gray-400">{t("cocina.sinPendientes")}</p>
          )}

          <div className="flex flex-col gap-3">
            {pendientes.map(pedido => (
              <div key={pedido.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{t("pedidos.mesa")} {pedido.mesa}</p>
                    <p className="text-sm text-gray-500">{pedido.plato?.nombre}</p>
                  </div>
                  <span className="badge bg-yellow-100 text-yellow-700">{t("pedidos.pendientes")}</span>
                </div>
                <button
                  className="btn btn-primary mt-3 w-full"
                  onClick={() => avanzarEstado(pedido.id)}
                >
                  {t("cocina.iniciarPreparacion")}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* EN PROCESO */}
        <div className="bg-blue-50 rounded-xl border p-5">
          <h2 className="font-semibold text-blue-700 mb-4">
            {t("pedidos.enProceso")} ({enProceso.length})
          </h2>

          {enProceso.length === 0 && (
            <p className="text-sm text-gray-400">{t("cocina.sinEnProceso")}</p>
          )}

          <div className="flex flex-col gap-3">
            {enProceso.map(pedido => (
              <div key={pedido.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{t("pedidos.mesa")} {pedido.mesa}</p>
                    <p className="text-sm text-gray-500">{pedido.plato?.nombre}</p>
                  </div>
                  <span className="badge bg-blue-100 text-blue-700">{t("pedidos.enProceso")}</span>
                </div>
                <button
                  className="btn btn-success mt-3 w-full"
                  onClick={() => avanzarEstado(pedido.id)}
                >
                  {t("cocina.marcarListo")}
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
