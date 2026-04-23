import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        const auth = "Basic " + btoa(email + ":" + password);

        fetch("/auth/me", {
            method: "GET",
            headers: {
                "Authorization": auth
            }
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(usuario => {

                //  guardamos auth
                localStorage.setItem("auth", auth);

                //  guardamos datos del usuario
                localStorage.setItem("usuario", JSON.stringify(usuario));

                window.location.href = "/inicio";
            })
            .catch(() => {
                setError("Credenciales incorrectas");
            });
    };

    return (
        <div className="min-h-screen flex">

            {/* IZQUIERDA */}
            <div className="hidden md:flex w-1/2 relative text-white">

                {/* IMAGEN */}
                <img
                    src="/imagen-restaurante.jpg"
                    alt="Restaurante"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => e.target.src = "/imagen-default.jpg"}
                />

                {/* OVERLAY ÁMBAR */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-700/50 to-orange-600/40"></div>

                {/*  MÁS OSCURO ABAJO */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>

                {/* CONTENIDO */}
                <div className="relative z-10 flex flex-col justify-end p-12">

                    <h1 className="text-4xl font-semibold mb-4">
                        Gestión QR
                    </h1>

                    <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                        Aplicación para gestionar pedidos en restaurante de forma sencilla,
                        controlando en tiempo real desde cocina, sala y administración
                    </p>

                    <div className="space-y-2 text-base text-gray-300">
                        <p className="text-amber-400">✔ Pedidos centralizados</p>
                        <p className="text-amber-400">✔ Comunicación cocina-sala</p>
                        <p className="text-amber-400">✔ Seguimiento en tiempo real</p>
                    </div>
                </div>
            </div>

            {/* DERECHA */}
            <div className="flex w-full md:w-1/2 items-center justify-center bg-white">

                <form
                    onSubmit={handleLogin}
                    className="w-80"
                >
                   
                    <p className="text-amber-600 font-semibold text-3xl mb-2">
                        ¡Bienvenido/a!
                    </p>

                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                        Iniciar sesión
                    </h2>

                    <p className="text-gray-500 mb-6 text-sm">
                        Accede al sistema
                    </p>

                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700 transition font-medium"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;