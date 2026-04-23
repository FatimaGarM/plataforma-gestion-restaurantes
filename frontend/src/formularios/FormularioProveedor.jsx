import { useState, useEffect } from "react";
import { useIdioma } from "../context/IdiomaContext";

function FormularioProveedor({
    nombre,
    telefono,
    email,
    onNombreChange,
    onTelefonoChange,
    onEmailChange,
    onCancelar,
    onSubmit
}) {

    const { t } = useIdioma();



    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">

            {/* NOMBRE */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("productos.producto")}</p>
                <input
                    type="text"
                    placeholder={t("proveedores.nombre")}
                    value={nombre}
                    onChange={onNombreChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 mb-2"
                    required
                />
            </div>

            {/* TELÉFONO */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("proveedores.telefono")}</p>
                <input
                    type="tel"
                    placeholder={t("proveedores.telefono.placeholder")}
                    value={telefono}
                    onChange={onTelefonoChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 mb-2"
                    required
                />
            </div>

            {/* EMAIL */}
            <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">{t("proveedores.email")}</p>
                <input
                    type="email"
                    placeholder={t("proveedores.email.placeholder")}
                    value={email}
                    onChange={onEmailChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300 mb-2"
                    required
                />
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="px-4 py-2 rounded-lg text-sm border text-gray-600 hover:bg-gray-100 transition"
                >
                    {t("cancelar")}
                </button>

                <button className="px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition">
                    {t("guardar")}
                </button>
            </div>

        </form>
    );
}

export default FormularioProveedor;