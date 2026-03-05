import { useEffect, useState } from "react";

function GestionCarta() {

    const [platos, setPlatos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState(null);


    useEffect(() => {
        cargarPlatos();
    }, []);


    function cargarPlatos() {
        fetch("http://localhost:8080/platos")
            .then(res => res.json())
            .then(data => setPlatos(data));
    }


    function guardarPlato(e) {

        e.preventDefault();

        console.log("Guardando plato...");

        const formData = new FormData();

        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        formData.append("precio", parseFloat(precio));
        formData.append("imagen", imagen);

        fetch("http://localhost:8080/platos/con-imagen", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log("Plato guardado", data);
                cargarPlatos();
                setMostrarFormulario(false);
            })
            .catch(error => console.log("Error:", error));

    }

    return (

        <div className="p-6">

            <div className="flex justify-between mb-4">

                <h1 className="text-xl font-bold">
                    Platos y Bebidas
                </h1>

                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    + Añadir plato
                </button>

            </div>


            {mostrarFormulario && (

                <form
                    onSubmit={guardarPlato}
                    className="mb-6 flex gap-2 flex-wrap"
                >

                    <input
                        type="text"
                        placeholder="Nombre"
                        onChange={(e) => setNombre(e.target.value)}
                        className="border p-2"
                    />

                    <input
                        type="text"
                        placeholder="Descripción"
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="border p-2"
                    />

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        onChange={(e) => setPrecio(e.target.value)}
                    />

                    <input
                        type="file"
                        onChange={(e) => setImagen(e.target.files[0])}
                        className="border p-2"
                    />

                    <button className="bg-orange-400 text-white px-3 py-2">
                        Guardar
                    </button>

                </form>

            )}



            <table className="w-full border">

                <thead className="bg-gray-200 text-center">

                    <tr>

                        <th className="border p-2">
                            Nombre
                        </th>

                        <th className="border p-2">
                            Descripción
                        </th>

                        <th className="border p-2">
                            Precio
                        </th>

                        <th className="border p-2">
                            Acciones
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {platos.map(plato => (

                        <tr key={plato.id}>

                            <td className="border p-2">
                                <div className="flex items-center justify-left gap-2">

                                    <img
                                        src={`http://localhost:8080/uploads/${plato.imagen}`}
                                        className="w-10 h-10 rounded"
                                    />

                                    <span>{plato.nombre}</span>

                                </div>
                            </td>


                            <td className="border p-2 text-center">
                                {plato.descripcion}
                            </td>


                            <td className="border p-2 text-center">
                                {plato.precio} €
                            </td>


                            <td className="border p-2 text-center">

                                <button className="bg-gray-300 px-2 mr-2">
                                    Editar
                                </button>

                                <button className="bg-red-500 text-white px-2">
                                    Eliminar
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}

export default GestionCarta;