import { useEffect, useState } from "react";

function GestionarEmpleados() {

    const [empleados, setEmpleados] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [tipoEmpleado, setTipoEmpleado] = useState("Camarero");
    const [estado, setEstado] = useState("Activo");
    const [imagen, setImagen] = useState(null);


    useEffect(() => {
        cargarEmpleados();
    }, []);


    function cargarEmpleados() {
        fetch("http://localhost:8080/empleados")
            .then(res => res.json())
            .then(data => setEmpleados(data));
    }


    function guardarEmpleado(e) {

        e.preventDefault();

        console.log("Guardando empleado...");

        const formData = new FormData();

        formData.append("nombre", nombre);
        formData.append("email", email);
        formData.append("contraseña", contraseña);
        formData.append("tipoEmpleado", tipoEmpleado);
        formData.append("estado", estado);
        formData.append("imagen", imagen);

        fetch("http://localhost:8080/empleados/con-imagen", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log("Empleado guardado", data);
                cargarEmpleados();
                setMostrarFormulario(false);
            })
            .catch(error => console.log("Error:", error));

    }

    return (

        <div className="p-6">

            <div className="flex justify-between mb-4">

                <h1 className="text-xl font-bold">
                    Empleados
                </h1>

                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    + Añadir empleado
                </button>

            </div>


            {mostrarFormulario && (

                <form
                    onSubmit={guardarEmpleado}
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
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        onChange={(e) => setContraseña(e.target.value)}
                        className="border p-2"
                    />

                    <select
                        onChange={(e) => setTipoEmpleado(e.target.value)}
                        className="border p-2"
                    >
                        <option value="Camarero">Camarero</option>
                        <option value="Cocinero">Cocinero</option>
                        <option value="Gerente">Gerente</option>
                    </select>

                    <select
                        onChange={(e) => setEstado(e.target.value)}
                        className="border p-2"
                    >
                        <option value="Activo">En activo</option>
                        <option value="Descanso">En descanso</option>
                        <option value="Vacaciones">En vacaciones</option>
                    </select>

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
                            Foto
                        </th>

                        <th className="border p-2">
                            Nombre
                        </th>

                        <th className="border p-2">
                            Email
                        </th>

                        <th className="border p-2">
                            Contraseña
                        </th>

                        <th className="border p-2">
                            Tipo Empleado
                        </th>

                        <th className="border p-2">
                            Estado
                        </th>
                        <th className="border p-2">
                            Acciones
                        </th>
                    </tr>

                </thead>


                <tbody>

                    {empleados.map(empleado => (

                        <tr key={empleado.id}>

                            <td className="border p-2">
                                <div className="flex items-center justify-left gap-2">

                                    <img
                                        src={`http://localhost:8080/uploads/FotosEmpleados/${empleado.imagen}`}
                                        className="w-10 h-10 rounded"
                                    />

                                    <span>{empleado.nombre}</span>

                                </div>
                            </td>

                            <td className="border p-2 text-center">
                                {empleado.nombre}
                            </td>

                            <td className="border p-2 text-center">
                                {empleado.email}
                            </td>


                            <td className="border p-2 text-center">
                                {empleado.contraseña}
                            </td>

                            <td className="border p-2 text-center">
                                {empleado.tipoEmpleado}
                            </td>

                            <td className="border p-2 text-center">
                                {empleado.estado}
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

export default GestionarEmpleados;