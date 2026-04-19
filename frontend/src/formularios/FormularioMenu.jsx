import { useState, useEffect } from "react";

function FormularioMenu({
    nombre,
    precio,
    dia,
    platos,
    onNombreChange,
    onPrecioChange,
    onDiaChange,
    onPlatoToggle,
    onCancelar,
    onSubmit,
    editar
    
}) {

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre del menu..."
                    value={nombre}
                    onChange={onNombreChange}
                    className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                    required
                />
            </div>

            <div className="flex gap-1">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Precio (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={precio}
                        onChange={onPrecioChange}
                        className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                        required
                        min="0"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Día</label>
                    <select
                        value={dia}
                        onChange={onDiaChange}
                        className="bg-white border px-4 py-2 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-emerald-300"
                        required
                    >
                        <option value="">Selecciona un día</option>
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Platos</label>
                    <table className="w-full text-left border">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1 text-sm">Nombre</th>
                                <th className="border px-2 py-1 text-sm">Tipo</th>
                                <th className="border px-2 py-1 text-sm">Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {platos.map(plato => (
                                <tr key={plato.id}>
                                    <td className="border px-2 py-1 text-sm">{plato.nombre}</td>
                                    <td className="border px-2 py-1 text-sm">{plato.tipo}</td>
                                    <td className="border px-2 py-1 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={plato.seleccionado || false}
                                            onChange={() => onPlatoToggle(plato.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="px-4 py-2 rounded-lg text-sm border text-gray-600 hover:bg-gray-100 transition"
                >
                    Cancelar
                </button>

                <button className="px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition">
                    Guardar
                </button>
            </div>

        </form>
    );
}

export default FormularioPlato;