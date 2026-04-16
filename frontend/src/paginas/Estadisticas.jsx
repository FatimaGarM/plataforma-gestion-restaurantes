import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";
import { Receipt, ClipboardList, Trophy, Medal, Utensils, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

const FRANJA_COLORES = ["#10b981", "#6366f1", "#f59e0b"];

function Estadisticas() {

  const [stats, setStats] = useState(null);
  const [periodo, setPeriodo] = useState("30d");
  const { t } = useIdioma();

  useEffect(() => {
    setStats(null);
    authFetch(`/estadisticas?periodo=${periodo}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, [periodo]);

  const porcentajeIngresos = stats && stats.ingresosAyer > 0
    ? (((stats.ingresosHoy - stats.ingresosAyer) / stats.ingresosAyer) * 100).toFixed(1)
    : stats?.ingresosHoy > 0 ? "+100" : "0";

  const porcentajePedidos = stats && stats.pedidosAyer > 0
    ? (((stats.pedidosHoy - stats.pedidosAyer) / stats.pedidosAyer) * 100).toFixed(1)
    : stats?.pedidosHoy > 0 ? "+100" : "0";

  const franjaMap = { Desayuno: t("stats.desayuno"), Comida: t("stats.comida"), Cena: t("stats.cena") };
  const diaFullMap = {
    Lunes: t("stats.lunes"), Martes: t("stats.martes"), "Miércoles": t("stats.miercoles"),
    Jueves: t("stats.jueves"), Viernes: t("stats.viernes"), Sábado: t("stats.sabado"), Domingo: t("stats.domingo")
  };

  const afluenciaData = (stats?.afluencia || []).map((d, i) => ({
    ...d,
    franja: franjaMap[d.franja] || d.franja,
    color: FRANJA_COLORES[i] || "#888"
  }));

  const diasData = (stats?.diasSemana || []).map(d => ({
    ...d,
    dia: (diaFullMap[d.dia] || d.dia).substring(0, 3).toUpperCase()
  }));

  const totalAfluencia = afluenciaData.reduce((s, d) => s + d.cantidad, 0);

  return (
    <div className="container-page">

      <div className="flex items-center justify-between mb-6">
        <h1 className="title">{t("stats.titulo")}</h1>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { key: "30d", label: t("stats.periodo30d") },
            { key: "2m",  label: t("stats.periodo2m")  },
            { key: "3m",  label: t("stats.periodo3m")  },
            { key: "6m",  label: t("stats.periodo6m")  },
            { key: "1y",  label: t("stats.periodo1y")  },
          ].map(op => (
            <button
              key={op.key}
              onClick={() => setPeriodo(op.key)}
              className={`px-3 py-1.5 text-xs rounded-lg transition font-medium
                ${periodo === op.key ? "bg-white shadow text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {!stats && <p className="text-gray-400 text-sm">{t("stats.cargando")}</p>}
      {stats && <>

      {/* ===== KPI CARDS ===== */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div className="rounded-2xl p-6" style={{ background: "#d1fae5" }}>
          <div className="flex items-start gap-4">
            <Receipt className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600 mb-1">{t("stats.ingresosHoy")}</p>
              <p className="text-3xl font-bold text-emerald-700">{stats.ingresosHoy.toFixed(2)}€</p>
              <p className={`text-xs mt-2 font-medium ${Number(porcentajeIngresos) >= 0 ? "text-green-600" : "text-red-500"}`}>
                {Number(porcentajeIngresos) >= 0 ? "↑" : "↓"} {Math.abs(porcentajeIngresos)}% {t("stats.vsAyer")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "#fce7e7" }}>
          <div className="flex items-start gap-4">
            <ClipboardList className="w-10 h-10 text-red-400" />
            <div>
              <p className="text-sm text-gray-600 mb-1">{t("stats.pedidosHoy")}</p>
              <p className="text-3xl font-bold text-red-500">{stats.pedidosHoy}</p>
              <p className={`text-xs mt-2 font-medium ${Number(porcentajePedidos) >= 0 ? "text-green-600" : "text-red-500"}`}>
                {Number(porcentajePedidos) >= 0 ? "↑" : "↓"} {Math.abs(porcentajePedidos)}% {t("stats.vsAyer")}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ===== GRID PRINCIPAL ===== */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-6">

          {/* DONUT - Tramo con más ventas */}
          <div className="card">
            <h2 className="font-semibold text-gray-700 mb-4">{t("stats.tramoMasVentas")}</h2>
            {totalAfluencia === 0
              ? <p className="text-sm text-gray-400">{t("stats.sinDatos")}</p>
              : (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={afluenciaData}
                        dataKey="cantidad"
                        nameKey="franja"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        strokeWidth={0}
                      >
                        {afluenciaData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-3">
                    {afluenciaData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
                        <span className="text-gray-600 w-20">{d.franja}</span>
                        <span className="font-semibold text-gray-800">
                          {totalAfluencia > 0 ? Math.round((d.cantidad / totalAfluencia) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* BAR - Días que más se vende */}
          <div className="card">
            <h2 className="font-semibold text-gray-700 mb-4">{t("stats.diasQueMasSeVende")}</h2>
            {diasData.every(d => d.cantidad === 0)
              ? <p className="text-sm text-gray-400">{t("stats.sinDatos")}</p>
              : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={diasData} barSize={22}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
          </div>

        </div>

        {/* COLUMNA DERECHA */}
        <div className="flex flex-col gap-6">

          {/* RANKING PLATOS MÁS VENDIDOS */}
          <div className="card">
            <h2 className="font-semibold text-gray-700 mb-4">{t("stats.platosMasVendidos")}</h2>
            {stats.rankingPlatos.length === 0
              ? <p className="text-sm text-gray-400">{t("stats.sinDatos")}</p>
              : (
                <div className="flex flex-col gap-3">
                  {stats.rankingPlatos.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {p.imagen
                        ? <img src={`http://localhost:8080/uploads/FotoPlatos/${p.imagen}`} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        : <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                        <p className="text-xs text-gray-400">{t("stats.seHaPedido")} {p.cantidad} {t("stats.veces")}</p>
                      </div>
                      {i === 0 ? <Trophy className="w-5 h-5 text-amber-500" /> : i === 1 ? <Medal className="w-5 h-5 text-gray-400" /> : <Utensils className="w-5 h-5 text-gray-300" />}
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* NOVEDADES CON MEJOR ACEPTACIÓN */}
          <div className="card">
            <h2 className="font-semibold text-gray-700 mb-4">{t("stats.novedosos")}</h2>
            {stats.rankingNovedosos.length === 0
              ? <p className="text-sm text-gray-400">{t("stats.sinDatos")}</p>
              : (
                <div className="flex flex-col gap-3">
                  {stats.rankingNovedosos.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {p.imagen
                        ? <img src={`http://localhost:8080/uploads/FotoPlatos/${p.imagen}`} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        : <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                        {p.diasDesde != null && (
                          <p className="text-xs text-gray-400">
                            {t("stats.introducidoHace")} {p.diasDesde} {t("stats.dias")}
                          </p>
                        )}
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              )}
          </div>

        </div>

      </div>

      </>}
    </div>
  );
}

export default Estadisticas;