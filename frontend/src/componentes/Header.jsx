import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { useIdioma } from "../context/IdiomaContext";

function Header() {

    let usuario = {};
    try { usuario = JSON.parse(localStorage.getItem("usuario")) || {}; } catch { /* localStorage inválido */ }
    const navigate = useNavigate();
    const { idioma, setIdioma, t } = useIdioma();

    const [nombreRestaurante, setNombreRestaurante] = useState("Mi Restaurante");
    const [logoRestaurante, setLogoRestaurante] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("auth")) return;
        authFetch("/configuracion")
            .then(res => res?.json?.())
            .then(data => {
                if (data?.nombreRestaurante) setNombreRestaurante(data.nombreRestaurante);
                if (data?.logo) setLogoRestaurante(data.logo);
            })
            .catch(() => {});
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header className="bg-white px-6 py-3 flex justify-between items-center border-b border-gray-200">

            <div className="flex items-center gap-3">
                {logoRestaurante && (
                    <img
                        src={`http://localhost:8080/uploads/Configuracion/${logoRestaurante}`}
                        alt="Logo"
                        className="w-9 h-9 rounded-lg object-cover"
                    />
                )}
                <h1 className="font-semibold text-gray-800">
                    {nombreRestaurante}
                </h1>
            </div>

            <div className="flex items-center gap-5">

                {/* IDIOMA */}
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <button
                        onClick={() => setIdioma("es")}
                        className={`cursor-pointer transition ${idioma === "es" ? "font-bold text-black" : "hover:text-black"}`}
                    >
                        ES
                    </button>
                    <span>|</span>
                    <button
                        onClick={() => setIdioma("en")}
                        className={`cursor-pointer transition ${idioma === "en" ? "font-bold text-black" : "hover:text-black"}`}
                    >
                        EN
                    </button>
                </div>

                {/* USUARIO */}
                <div className="flex items-center gap-3">

                    <div className="text-right">
                        <p className="text-sm font-medium">{usuario?.nombre}</p>
                        <p className="text-xs text-gray-500">{usuario?.tipoEmpleado}</p>
                    </div>

                    {usuario?.imagen ? (
                        <img
                            src={`http://localhost:8080/uploads/FotosEmpleados/${usuario.imagen}`}
                            alt="usuario"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                            {usuario?.nombre?.charAt(0)}
                        </div>
                    )}

                </div>

                {/* LOGOUT */}
                <button
                    onClick={logout}
                    className="text-sm text-red-500 hover:text-red-600"
                >
                    {t("salir")}
                </button>

            </div>

        </header>
    );
}

export default Header;