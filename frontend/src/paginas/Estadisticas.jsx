import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Estadisticas() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/pedidos/estadisticas")
  .then(res => res.json())
  .then(data => {
    if (!data) return;

    const estados = data.porEstado
      ? data.porEstado.map(e => ({
          name: e[0],
          value: e[1]
        }))
      : [];

    setStats({
      totalPedidos: data.totalPedidos || 0,
      ingresos: data.ingresos || 0,
      estados
    });
  })
  .catch(() => {
    // fallback si backend no está listo
    setStats({
      totalPedidos: 0,
      ingresos: 0,
      estados: []
    });
  });
  }, []);

  if (!stats) return <p className="p-6">Cargando estadísticas...</p>;

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Estadísticas del restaurante
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Pedidos totales</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalPedidos}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Ingresos</p>
          <p className="text-3xl font-bold text-emerald-600">
            {stats.ingresos} €
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Estados</p>
          <p className="text-xl font-semibold text-gray-700">
            {stats.estados[0]?.name || "—"}
          </p>
        </div>

      </div>

      {/* GRÁFICA */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <h2 className="text-lg font-semibold mb-4">
          Pedidos por estado
        </h2>

        <div className="w-full h-80">

          <ResponsiveContainer>
            <PieChart>

              <Pie
                data={stats.estados}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {stats.estados.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default Estadisticas;