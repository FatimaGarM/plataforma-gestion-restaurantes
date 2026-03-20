import { useNavigate } from "react-router-dom";

function Header() {

    let usuario = {};
    try { usuario = JSON.parse(localStorage.getItem("usuario")) || {}; } catch { /* localStorage inválido */ }
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header className="bg-white px-6 py-3 flex justify-between items-center border-b border-gray-200">

            <h1 className="font-semibold text-gray-800">
                Restaurante La Plaza
            </h1>

            <div className="flex items-center gap-5">

                {/* IDIOMA */}
                <div className="text-sm text-gray-500">
                    <span className="cursor-pointer hover:text-black">ES</span>
                    <span className="mx-1">|</span>
                    <span className="cursor-pointer hover:text-black">EN</span>
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
                    Salir
                </button>

            </div>

        </header>
    );
}

export default Header;