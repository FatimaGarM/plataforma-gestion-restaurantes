import { useEffect, useState } from "react";
import FormularioPlato from "../formularios/FormularioPlato";
import ConfirmacionEliminar from "../componentes/ConfirmacionEliminar";
import DialogoModal from "../componentes/DialogoModal";

function GestionCarta() {

    const [platos, setPlatos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState(null);
    const [editar, setEditar] = useState(false);
    const [platoAEliminar, setPlatoAEliminar] = useState(null);


    useEffect(() => {
        cargarPlatos();
    }, []);


    function cargarPlatos() {
        fetch("/platos")
            .then(res => res.json())
            .then(data => setPlatos(data));
    }


    function limpiarFormularioPlato() {
        setId(null);
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setImagen(null);
        setEditar(false);
    }


    function abrirFormularioCrear() {
        limpiarFormularioPlato();
        setMostrarFormulario(true);
    }


    function cerrarFormulario() {
        setMostrarFormulario(false);
        limpiarFormularioPlato();
    }


    function solicitarEliminarPlato(plato) {
        setMostrarFormulario(false);
        setPlatoAEliminar(plato);
        setMostrarConfirmacionEliminar(true);
    }


    function cancelarEliminarPlato() {
        setMostrarConfirmacionEliminar(false);
        setPlatoAEliminar(null);
    }


    function confirmarEliminarPlato() {

        if (platoAEliminar == null) {
            return;
        }

        fetch(`/platos/${platoAEliminar.id}`, {
            method: "DELETE"
        })
            .then(res => {

                if (res.ok) {
                    console.log("Plato eliminado");
                    cargarPlatos();
                } else {
                    console.log("Error al eliminar plato");
                }

            })
            .catch(error => console.log("Error:", error))
            .finally(() => {

                cancelarEliminarPlato();
                cerrarFormulario();

            });

    }


    function editarPlato(idPlato) {

        setEditar(true);

        fetch(`/platos/${idPlato}`)
            .then(res => res.json())
            .then(data => {

                setId(idPlato);
                setNombre(data.nombre);
                setDescripcion(data.descripcion);
                setPrecio(data.precio);
                setImagen(null);
                setMostrarFormulario(true);

            })
            .catch(error => console.log("Error:", error));

    }


    function guardarPlato(e) {

        e.preventDefault();

        const formData = new FormData();

        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        formData.append("precio", parseFloat(precio));

        if (imagen != null) {
            formData.append("imagen", imagen);
        }

        if (id != null) {

            fetch(`/platos/${id}`, {
                method: "PUT",
                body: formData
            })
                .then(res => res.json())
                .then(data => {

                    console.log("Plato actualizado", data);
                    cargarPlatos();
                    cerrarFormulario();

                })
                .catch(error => console.log("Error:", error));

        } else {

            fetch("/platos/con-imagen", {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {

                    console.log("Plato guardado", data);
                    cargarPlatos();
                    cerrarFormulario();

                })
                .catch(error => console.log("Error:", error));

        }

    }


    return (

        <div className="p-6">

            <div className="flex justify-between mb-4">

                <h1 className="text-xl font-bold">
                    Platos y Bebidas
                </h1>

                <button
                    onClick={abrirFormularioCrear}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    + Añadir plato
                </button>

            </div>


            <DialogoModal
                abierto={mostrarFormulario}
                onCerrar={cerrarFormulario}
                titulo={editar ? "Editar plato" : "Crear nuevo plato"}
            >

                <FormularioPlato
                    nombre={nombre}
                    descripcion={descripcion}
                    precio={precio}
                    onNombreChange={(e) => setNombre(e.target.value)}
                    onDescripcionChange={(e) => setDescripcion(e.target.value)}
                    onPrecioChange={(e) => setPrecio(e.target.value)}
                    onImagenChange={(e) => setImagen(e.target.files[0])}
                    onCancelar={cerrarFormulario}
                    onSubmit={guardarPlato}
                    editar={editar}
                />

            </DialogoModal>


            <ConfirmacionEliminar
                abierto={mostrarConfirmacionEliminar}
                titulo="Eliminar plato"
                mensaje={
                    platoAEliminar
                        ? `Se eliminará "${platoAEliminar.nombre}". Esta acción no se puede deshacer.`
                        : "Esta acción no se puede deshacer."
                }
                onCancelar={cancelarEliminarPlato}
                onConfirmar={confirmarEliminarPlato}
            />


            <table className="w-full border">

                <thead className="bg-gray-200 text-center">

                    <tr>

                        <th className="border p-2">
                            Plato
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

                                <div className="flex items-center gap-3">

                                    <img
                                        src={plato.imagen ? `/uploads/FotoPlatos/${plato.imagen}` : ""}
                                        className="w-10 h-10 rounded object-cover bg-gray-100"
                                        alt={plato.nombre}
                                    />

                                    <span>
                                        {plato.nombre}
                                    </span>

                                </div>

                            </td>


                            <td className="border p-2 text-center">
                                {plato.descripcion}
                            </td>


                            <td className="border p-2 text-center">
                                {plato.precio} €
                            </td>


                            <td className="border p-2 text-center">

                                <button
                                    className="bg-gray-300 px-2 mr-2"
                                    onClick={() => editarPlato(plato.id)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="bg-red-500 text-white px-2"
                                    onClick={() => solicitarEliminarPlato(plato)}
                                >
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