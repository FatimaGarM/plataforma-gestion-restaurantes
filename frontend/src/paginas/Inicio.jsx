import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";

function Inicio() {

    let usuario = {};
    try { usuario = JSON.parse(localStorage.getItem("usuario")) || {}; } catch { /* localStorage inválido */ }

    const [pedidos, setPedidos] = useState([]);
    const [stats, setStats] = useState(null);
    const { t } = useIdioma();

    useEffect(() => {
        authFetch("/pedidos/activos")
            .then(res => res.json())
            .then(data => {
                setPedidos(data);
            })
            .catch(() => {});

        if (usuario.tipoEmpleado === "GERENTE") {
            authFetch("/estadisticas")
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(() => {});
        }
    }, []);

    const pendientes = pedidos.filter(p => p.estado === "Pendiente").length;
    const enProceso = pedidos.filter(p => p.estado === "En proceso").length;
    const listos = pedidos.filter(p => p.estado === "Listo").length;

    return (
        <div className="container-page">

            <h1 className="title mb-2">{t("inicio.bienvenido")}, {usuario?.nombre}</h1>
            <p className="text-sm text-gray-500 mb-6">{usuario?.tipoEmpleado}</p>

            {/* ========== GERENTE ========== */}
            {usuario.tipoEmpleado === "GERENTE" && (
                <>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.pedidosHoy")}</p>
                            <p className="text-3xl font-bold text-amber-600">{stats?.pedidosHoy ?? "—"}</p>
                        </div>
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.ingresosHoy")}</p>
                            <p className="text-3xl font-bold text-emerald-600">
                                {stats ? `${stats.ingresosHoy.toFixed(2)} €` : "—"}
                            </p>
                        </div>
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.pendientesAhora")}</p>
                            <p className="text-3xl font-bold text-yellow-600">{pendientes}</p>
                        </div>
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.listosParaServir")}</p>
                            <p className="text-3xl font-bold text-green-600">{listos}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <Link to="/estadisticas" className="card hover:shadow-md transition text-center">
                            <p className="text-amber-600 font-semibold">{t("inicio.estadisticas")}</p>
                            <p className="text-xs text-gray-400">{t("inicio.verMetricas")}</p>
                        </Link>
                        <Link to="/gestion-carta" className="card hover:shadow-md transition text-center">
                            <p className="text-amber-600 font-semibold">{t("inicio.carta")}</p>
                            <p className="text-xs text-gray-400">{t("inicio.gestionarPlatos")}</p>
                        </Link>
                        <Link to="/gestion-pedidos" className="card hover:shadow-md transition text-center">
                            <p className="text-amber-600 font-semibold">{t("inicio.pedidos")}</p>
                            <p className="text-xs text-gray-400">{t("inicio.verTodosPedidos")}</p>
                        </Link>
                    </div>
                </>
            )}

            {/* ========== CAMARERO ========== */}
            {usuario.tipoEmpleado === "CAMARERO" && (
                <>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.listosParaServir")}</p>
                            <p className="text-3xl font-bold text-green-600">{listos}</p>
                        </div>
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.enCocina")}</p>
                            <p className="text-3xl font-bold text-blue-600">{pendientes + enProceso}</p>
                        </div>
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.totalActivos")}</p>
                            <p className="text-3xl font-bold text-amber-600">{pedidos.length}</p>
                        </div>
                    </div>

                    <Link to="/pedidos" className="card hover:shadow-md transition text-center block">
                        <p className="text-amber-600 font-semibold">{t("inicio.irAPedidos")}</p>
                        <p className="text-xs text-gray-400">{t("inicio.verPedidosMesa")}</p>
                    </Link>
                </>
            )}

            {/* ========== COCINERO ========== */}
            {usuario.tipoEmpleado === "COCINERO" && (
                <>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.pedidosEsperando")}</p>
                            <p className="text-3xl font-bold text-yellow-600">{pendientes}</p>
                        </div>
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.enPreparacion")}</p>
                            <p className="text-3xl font-bold text-blue-600">{enProceso}</p>
                        </div>
                        <div className="card">
                            <p className="text-sm text-gray-500">{t("inicio.listos")}</p>
                            <p className="text-3xl font-bold text-green-600">{listos}</p>
                        </div>
                    </div>

                    <Link to="/cocina" className="card hover:shadow-md transition text-center block">
                        <p className="text-amber-600 font-semibold">Ir a Cocina</p>
                        <p className="text-xs text-gray-400">Gestionar pedidos</p>
                    </Link>
                </>
            )}

        </div>
    );
}

export default Inicio;