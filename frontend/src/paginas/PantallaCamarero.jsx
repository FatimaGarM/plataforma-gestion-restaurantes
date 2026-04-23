import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";

function PantallaCamarero() {
  const [pedidos, setPedidos] = useState([]);
  const [mesasConSesion, setMesasConSesion] = useState([]);
  const [cobrosPendientes, setCobrosPendientes] = useState([]);
  const { t } = useIdioma();

  useEffect(() => {
    cargarTodo();
    const intervalo = setInterval(cargarTodo, 5000);
    return () => clearInterval(intervalo);
  }, []);

  function cargarTodo() {
    Promise.all([
      authFetch("/pedidos/activos").then(res => res.json()),
      authFetch("/servicios/mesas-con-sesion").then(res => res.json()),
      authFetch("/servicios/cobros-pendientes").then(res => res.json())
    ])
      .then(([activos, mesas, cobros]) => {
        setPedidos(Array.isArray(activos) ? activos : []);
        setMesasConSesion(Array.isArray(mesas) ? mesas : []);
        setCobrosPendientes(Array.isArray(cobros) ? cobros : []);
      })
      .catch(() => {});
  }

  function servirPedido(id) {
    authFetch(`/pedidos/${id}/siguiente-estado`, { method: "PUT" })
      .then(res => res.json())
      .then(() => cargarTodo())
      .catch(() => {});
  }

  function cerrarMesa(mesa) {
    authFetch(`/servicios/${mesa}/cerrar`, { method: "PUT" })
      .then(() => cargarTodo())
      .catch(() => {});
  }

  function atenderCobro(mesa) {
    authFetch(`/servicios/${mesa}/cobro/atender`, { method: "PUT" })
      .then(() => cargarTodo())
      .catch(() => {});
  }

  function marcarCobroPersona(mesa, persona, cobrado = true) {
    authFetch(`/servicios/${mesa}/cobro/persona/${persona}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cobrado })
    })
      .then(() => cargarTodo())
      .catch(() => {});
  }

  function marcarCobroTotal(mesa) {
    authFetch(`/servicios/${mesa}/cobro/total`, { method: "PUT" })
      .then(() => cargarTodo())
      .catch(() => {});
  }

  function etiquetaEstadoCobro(estado) {
    switch (estado) {
      case "PENDIENTE_COBRO": return "Pendiente";
      case "COBRANDO": return "Atendiendo";
      case "COBRADO_PARCIAL": return "Parcial";
      case "COBRADO_TOTAL": return "Cobrado";
      default: return "Sin solicitud";
    }
  }

  const listos = pedidos.filter(p => p.estado === "Listo");
  const enCocina = pedidos.filter(p => p.estado === "Pendiente" || p.estado === "En proceso");

  const mesasListas = {};
  listos.forEach(p => {
    if (!mesasListas[p.mesa]) mesasListas[p.mesa] = [];
    mesasListas[p.mesa].push(p);
  });

  const mesasEnCocina = {};
  enCocina.forEach(p => {
    if (!mesasEnCocina[p.mesa]) mesasEnCocina[p.mesa] = [];
    mesasEnCocina[p.mesa].push(p);
  });

  return (
    <div className="container-page">

      <h1 className="title mb-6">{t("camarero.titulo")}</h1>

      <div className="mb-8">
        <h2 className="font-semibold text-amber-700 text-lg mb-4">
          Solicitudes de cobro ({cobrosPendientes.length})
        </h2>

        {cobrosPendientes.length === 0 && (
          <div className="card text-sm text-gray-400">No hay mesas esperando cobro.</div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cobrosPendientes.map((cobro) => (
            <div key={cobro.servicioId} className="bg-amber-50 rounded-xl border p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Mesa {cobro.mesa}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {cobro.metodoPagoSolicitado || "Sin metodo"} · {etiquetaEstadoCobro(cobro.estadoCobro)}
                  </p>
                </div>
                <button
                  onClick={() => atenderCobro(cobro.mesa)}
                  className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 px-2 py-1 rounded-lg transition"
                >
                  Atender
                </button>
              </div>

              <div className="space-y-2 mb-3">
                {(cobro.totalesPorPersona || []).map((persona) => (
                  <div key={persona.persona} className="bg-white rounded-lg px-3 py-2 border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold">
                          P{persona.persona}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Array.isArray(persona.items) && persona.items.length > 0
                            ? persona.items.map(item => item.nombre).join(", ")
                            : "Sin platos"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{Number(persona.total || 0).toFixed(2)} €</p>
                        <p className={`text-xs ${persona.cobrado ? "text-emerald-600" : "text-amber-600"}`}>
                          {persona.cobrado ? "Cobrado" : "Pendiente"}
                        </p>
                      </div>
                    </div>
                    {!persona.cobrado && (
                      <button
                        onClick={() => marcarCobroPersona(cobro.mesa, persona.persona, true)}
                        className="mt-2 w-full text-xs bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition"
                      >
                        Marcar cobrado P{persona.persona}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-sm font-semibold">Total mesa</p>
                <p className="text-lg font-bold">{Number(cobro.totalMesa || 0).toFixed(2)} €</p>
              </div>

              <button
                onClick={() => marcarCobroTotal(cobro.mesa)}
                className="mt-3 w-full text-sm bg-slate-800 text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition"
              >
                Marcar cobro total
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-red-700 text-lg mb-4">
          {t("camarero.mesasParaCerrar")} ({mesasConSesion.length})
        </h2>

        {mesasConSesion.length === 0 && (
          <div className="card text-sm text-gray-400">{t("camarero.sinMesasParaCerrar")}</div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mesasConSesion.map((mesa) => (
            <div key={mesa} className="bg-red-50 rounded-xl border p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Mesa {mesa}</h3>
                <button
                  onClick={() => cerrarMesa(mesa)}
                  className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-lg transition"
                  title={t("camarero.cerrarMesaTitle")}
                >
                  {t("camarero.cerrarMesa")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Mesa {mesa}</h3>
              </div>
              <div className="flex flex-col gap-2">
                {pedidosMesa.map(pedido => (
                  <div key={pedido.id} className="card">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {pedido.plato?.nombre}
                        {pedido.persona ? <span className="ml-2 text-xs text-amber-600 font-bold">P{pedido.persona}</span> : null}
                      </p>
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
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Mesa {mesa}</h3>
              </div>
              <div className="flex flex-col gap-2">
                {pedidosMesa.map(pedido => (
                  <div key={pedido.id} className="card">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {pedido.plato?.nombre}
                        {pedido.persona ? <span className="ml-2 text-xs text-amber-600 font-bold">P{pedido.persona}</span> : null}
                      </p>
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
