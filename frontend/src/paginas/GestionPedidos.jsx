import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";

function GestionPedidos() {

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
    const safe = (promise, fallback) =>
      promise.then(res => res.ok ? res.json() : fallback).catch(() => fallback);

    Promise.all([
      safe(authFetch("/pedidos/activos"), []),
      safe(authFetch("/servicios/mesas-con-sesion"), []),
      safe(authFetch("/servicios/cobros-pendientes"), []),
    ]).then(([activos, mesas, cobros]) => {
      setPedidos(Array.isArray(activos) ? activos : []);
      setMesasConSesion(Array.isArray(mesas) ? mesas : []);
      setCobrosPendientes(Array.isArray(cobros) ? cobros : []);
    });
  }

  function cambiarEstado(id) {
    authFetch(`/pedidos/${id}/siguiente-estado`, { method: "PUT" })
      .then(res => res.json())
      .then(() => cargarTodo());
  }

  function cerrarMesa(mesa) {
    if (!window.confirm(`¿Cerrar mesa ${mesa}?`)) return;
    authFetch(`/servicios/${mesa}/cerrar`, { method: "PUT" })
      .then(() => cargarTodo())
      .catch(() => alert("No se pudo cerrar la mesa. Inténtalo de nuevo."));
  }

  function atenderCobro(mesa) {
    authFetch(`/servicios/${mesa}/cobro/atender`, { method: "PUT" })
      .then(() => cargarTodo())
      .catch(() => {});
  }

  function marcarCobroPersona(mesa, persona) {
    authFetch(`/servicios/${mesa}/cobro/persona/${persona}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cobrado: true }),
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

      {/* SOLICITUDES DE COBRO */}
      <div className="mb-8">
        <div className={`flex items-center gap-3 mb-4 px-4 py-3 rounded-xl border-2 transition-all ${cobrosPendientes.length > 0 ? 'bg-amber-50 border-amber-400 shadow-md' : 'bg-white border-gray-200'}`}>
          <Bell size={22} className={`shrink-0 ${cobrosPendientes.length > 0 ? 'text-amber-600 animate-bounce' : 'text-gray-400'}`} />
          <h2 className={`font-bold text-lg ${cobrosPendientes.length > 0 ? 'text-amber-700' : 'text-gray-500'}`}>
            Solicitudes de cobro
            <span className={`ml-2 px-2 py-0.5 rounded-full text-sm font-bold ${cobrosPendientes.length > 0 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {cobrosPendientes.length}
            </span>
          </h2>
        </div>

        {cobrosPendientes.length === 0 && (
          <div className="card text-sm text-gray-400">No hay mesas esperando cobro.</div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cobrosPendientes.map((cobro) => (
            <div key={cobro.servicioId} className="bg-amber-50 rounded-xl border-2 border-amber-300 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Mesa {cobro.mesa}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {cobro.metodoPagoSolicitado || "Sin método"} · {etiquetaEstadoCobro(cobro.estadoCobro)}
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
                        <p className="text-sm font-semibold">P{persona.persona}</p>
                        <p className="text-xs text-gray-500">
                          {Array.isArray(persona.items) && persona.items.length > 0
                            ? persona.items.map(i => i.nombre).join(", ")
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
                        onClick={() => marcarCobroPersona(cobro.mesa, persona.persona)}
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

      {/* CERRAR MESAS */}
      <div className="mb-8">
        <h2 className="font-semibold text-red-700 text-lg mb-4">
          {t("camarero.mesasParaCerrar")} ({mesasConSesion.length})
        </h2>

        {mesasConSesion.length === 0 && (
          <div className="card text-sm text-gray-400">{t("camarero.sinMesasParaCerrar")}</div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mesasConSesion.map((mesa) => (
            <div key={mesa} className="bg-red-50 rounded-xl border p-4 flex justify-between items-center">
              <h3 className="font-semibold">Mesa {mesa}</h3>
              <button
                onClick={() => cerrarMesa(mesa)}
                className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-lg transition"
              >
                {t("camarero.cerrarMesa")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* KANBAN DE PEDIDOS */}
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