function Header() {
    return (
        <header className="bg-orange-200 border-b px-6 py-3 flex justify-between items-center">

            {/* Nombre restaurante */}
            <h1 className="font-semibold">
                Restaurante La Plaza
            </h1>

            {/* Usuario */}
            <div className="flex items-center gap-4 text-sm">

                <span>
                    Gustavo (Gerente)
                </span>
                
                <span>ES | EN</span>

                <button className="text-red-600">
                    Salir
                </button>

            </div>

        </header>
    );
}

export default Header;