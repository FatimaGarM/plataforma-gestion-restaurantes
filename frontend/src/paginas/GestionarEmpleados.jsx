import { useEffect, useState } from "react";
import FormularioEmpleado from "../formularios/FormularioEmpleado";
import ConfirmacionEliminar from "../componentes/ConfirmacionEliminar";
import DialogoModal from "../componentes/DialogoModal";

function GestionarEmpleados() {

    const [empleados, setEmpleados] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [tipoEmpleado, setTipoEmpleado] = useState("");
    const [estado, setEstado] = useState("");
    const [imagen, setImagen] = useState(null);
    const [editar, setEditar] = useState(false);
    const [empleadoEliminar, setEmpleadoEliminar] = useState(null);


    useEffect(() => {
        cargarEmpleados();
    }, []);


    function cargarEmpleados() {
        fetch("/empleados")
            .then(res => res.json())
            .then(data => setEmpleados(data));
    }

    function limpiarFormularioEmpleado() {
        setId(null);
        setNombre("");
        setEmail("");
        setContraseña("");
        setTipoEmpleado("");
        setEstado("");
        setImagen(null);
        setEditar(false);
    }

    function abrirFormularioCrear() {
        limpiarFormularioEmpleado();
        setMostrarFormulario(true);
    }

    function cerrarFormulario() {
        setMostrarFormulario(false);
        limpiarFormularioEmpleado();
    }

    function solicitarEliminarEmpleado(Empleado) {
        setMostrarFormulario(false);
        setEmpleadoEliminar(Empleado);
        setMostrarConfirmacionEliminar(true);
    }

    function cancelarEliminarEmpleado() {
        setMostrarConfirmacionEliminar(false);
        setEmpleadoEliminar(null);
    }

    function eliminarEmpleado(id) {
        if (empleadoEliminar == null) {
            return;
        }

        fetch(`/empleados/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    console.log("Empleado eliminado");
                    cargarEmpleados();
                } else {
                    console.log("Error al eliminar empleado");
                }
            })
            .catch(error => console.log("Error:", error));

        cancelarEliminarPlato();
        cerrarFormulario();
        
    }

    function editarEmpleado(id) {
        setEditar(true);
        console.log("Editar empleado con ID:", id);
        fetch(`/empleados/${id}`,{
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                setId(id);
                setNombre(data.nombre);
                setEmail(data.email);
                setContraseña(data.contraseña);
                setTipoEmpleado(data.tipoEmpleado);
                setEstado(data.estado);
                setMostrarFormulario(true);
            })
            .catch(error => console.log("Error:", error));

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
        if (imagen != null) {
            formData.append("imagen", imagen);
        }

        if (id != null) {
            fetch(`/empleados/actualizar/${id}`, {
                method: "PUT",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    console.log("Empleado guardado", data);
                })
                .catch(error => console.log("Error:", error));
        } else {
            fetch("/empleados/con-imagen", {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    console.log("Empleado guardado", data);
                })
                .catch(error => console.log("Error:", error));
        }
        cargarEmpleados();
        cerrarFormulario();
    }

    return (

        <div className="p-6">

            <div className="flex justify-between mb-4">

                <h1 className="text-xl font-bold">
                    Empleados
                </h1>

                <button
                    onClick={abrirFormularioCrear}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    + Añadir empleado
                </button>

            </div>

            <DialogoModal
                abierto={mostrarFormulario}
                onCerrar={cerrarFormulario}
                titulo={editar ? "Editar plato" : "Crear nuevo plato"}
            >

                <FormularioEmpleado
                    nombre={nombre}
                    email={email}
                    contraseña={contraseña}
                    onNombreChange={(e) => setNombre(e.target.value)}
                    onEmailChange={(e) => setEmail(e.target.value)}
                    onContraseñaChange={(e) => setContraseña(e.target.value)}
                    onImagenChange={(e) => setImagen(e.target.files[0])}
                    onCancelar={cerrarFormulario}
                    onSubmit={guardarEmpleado}
                    editar={editar}
                />

            </DialogoModal>

            <ConfirmacionEliminar
                abierto={mostrarConfirmacionEliminar}
                titulo="Eliminar plato"
                mensaje={
                    empleadoEliminar
                        ? `Se eliminará "${empleadoEliminar.nombre}". Esta acción no se puede deshacer.`
                        : "Esta acción no se puede deshacer."
                }
                onCancelar={cancelarEliminarEmpleado}
                onConfirmar={eliminarEmpleado(empleadoEliminar ? empleadoEliminar.id : null)}
            />

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
                                        src={`/uploads/FotosEmpleados/${empleado.imagen}`}
                                        className="w-10 h-10 rounded"
                                    />

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

                                <button className="bg-gray-300 px-2 mr-2" onClick={() => editarEmpleado(empleado.id)}>
                                    Editar
                                </button>

                                <button className="bg-red-500 text-white px-2" onClick={() => solicitarEliminarEmpleado(empleado)}>
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