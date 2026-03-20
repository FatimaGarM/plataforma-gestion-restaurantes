import { useEffect, useState } from "react";

function GestionarPedidos() {

    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        cargarPedidos();
    }, []);


    function cargarPedidos() {
        fetch("/pedidos/activos")
            .then(res => res.json())
            .then(data => setPedidos(data));
    }

    function actualizarEstadoPedido(id) {
        
        fetch(`/pedidos/${id}/siguiente-estado`, {
            method: "PUT"
        })
        .then(res => res.json())
        .then(data => {
            cargarPedidos();
        });
    }

return (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Pedidos</h1>

        <table className="w-full border">
            <thead>
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Mesa</th>
                    <th className="border p-2">Plato</th>
                    <th className="border p-2">Estado</th>
                    <th className="border p-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {pedidos.map(pedido => (
                    <tr key={pedido.id}>
                        <td className="border p-2">{pedido.id}</td>
                        <td className="border p-2">{pedido.mesa}</td>
                        <td className="border p-2">{pedido.plato.nombre}</td>
                        <td className="border p-2">{pedido.estado}</td>
                        <td className="border p-2">
                            <button
                                className="bg-green-500 text-white px-2"
                                onClick={() => actualizarEstadoPedido(pedido.id)}
                            >
                                Cambiar Estado
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}
export default GestionarPedidos;