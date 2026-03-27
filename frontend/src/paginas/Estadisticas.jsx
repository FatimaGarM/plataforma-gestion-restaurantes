import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

function Estadisticas() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
=======
    console.log("Cargando estadísticas...");
>>>>>>> origin/luis2
    fetch("/estadisticas")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  if (!stats) return <div className="container-page"><p className="text-gray-400">Cargando estadísticas...</p></div>;

  const porcentajeIngresos = stats.ingresosAyer > 0
    ? (((stats.ingresosHoy - stats.ingresosAyer) / stats.ingresosAyer) * 100).toFixed(1)
    : stats.ingresosHoy > 0 ? "+100" : "0";

  const porcentajePedidos = stats.pedidosAyer > 0
    ? (((stats.pedidosHoy - stats.pedidosAyer) / stats.pedidosAyer) * 100).toFixed(1)
    : stats.pedidosHoy > 0 ? "+100" : "0";

  return (
    <div className="container-page">

      <h1 className="title mb-6">Estadísticas</h1>

      {/* ===== TARJETAS RESUMEN ===== */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="card">
          <p className="text-sm text-gray-500">Ingresos hoy</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.ingresosHoy.toFixed(2)} €</p>
          <p className={`text-xs mt-1 ${Number(porcentajeIngresos) >= 0 ? "text-green-500" : "text-red-500"}`}>
            {Number(porcentajeIngresos) >= 0 ? "+" : ""}{porcentajeIngresos}% vs ayer
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500">Ingresos ayer</p>
          <p className="text-2xl font-bold text-gray-600">{stats.ingresosAyer.toFixed(2)} €</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500">Pedidos hoy</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pedidosHoy}</p>
          <p className={`text-xs mt-1 ${Number(porcentajePedidos) >= 0 ? "text-green-500" : "text-red-500"}`}>
            {Number(porcentajePedidos) >= 0 ? "+" : ""}{porcentajePedidos}% vs ayer
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500">Pedidos ayer</p>
          <p className="text-2xl font-bold text-gray-600">{stats.pedidosAyer}</p>
        </div>

      </div>

      {/* ===== GRÁFICAS ===== */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RANKING PLATOS MÁS VENDIDOS */}
        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Platos más vendidos</h2>
          {stats.rankingPlatos.length === 0
            ? <p className="text-sm text-gray-400">Sin datos aún</p>
            : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.rankingPlatos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="nombre" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>

        {/* RANKING PLATOS NOVEDOSOS */}
        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Aceptación de platos novedosos</h2>
          {stats.rankingNovedosos.length === 0
            ? <p className="text-sm text-gray-400">Sin datos aún</p>
            : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.rankingNovedosos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="nombre" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>

        {/* AFLUENCIA POR FRANJA */}
        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Afluencia por franja horaria</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.afluencia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="franja" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PEDIDOS POR DÍA */}
        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Días con más pedidos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.diasSemana}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

export default Estadisticas;