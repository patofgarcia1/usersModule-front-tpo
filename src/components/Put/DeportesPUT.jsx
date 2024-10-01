import { useRef, useState, useEffect  } from "react";
import { Mensaje } from "../Mensaje/Mensaje";
import { useNavigate, useParams } from "react-router-dom";
import ImagenPost from "../Imagen/ImagenPOST";
import './PUT.css'; 

export const DeportesPut = () => {
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [idDeporte, setIdDeporte] = useState(null);

    const {id}=useParams()

    const datForm = useRef(); // Referencia al formulario
    const navigate = useNavigate();

    // Simulación de deporte hardcodeado (esto se podría reemplazar con una llamada al backend para obtener el deporte real)
    const [deporteSeleccionado, setDeporteSeleccionado] = useState(null); // Deporte seleccionado para modificar
    const [deporte, setDeporte] = useState(null); // Estado para el deporte hardcodeado
   // Deportes hardcodeados (puede ser reemplazado por una llamada a la API para obtener los deportes)
   const deportes = [
    { id: 1, nombre: "Fútbol", descripcion: "Deporte de equipo jugado con una pelota en un campo rectangular.", valor: "5000", profesor: "Carlos Pérez" },
    { id: 2, nombre: "Basketball", descripcion: "Deporte de equipo que se juega en una cancha con dos aros.", valor: "4500", profesor: "María Gómez" },
    { id: 3, nombre: "Tennis", descripcion: "Deporte individual o de dobles jugado con raquetas y pelotas en una cancha dividida por una red.", valor: "6000", profesor: "Pedro Martínez" },
    ];

     // Función para manejar el cambio en el dropdown y cargar el deporte seleccionado
     const handleDeporteChange = (e) => {
        const deporteId = parseInt(e.target.value);
        const deporte = deportes.find(d => d.id === deporteId);
        setDeporteSeleccionado(deporte);
    };


    // Este efecto se ejecuta una vez para cargar los valores hardcodeados al estado.
    useEffect(() => {
        setDeporte(deporte);
    }, []);

    const consultarForm = async (e) => {
        e.preventDefault();

        const datosFormulario = new FormData(datForm.current); 
        const deporte = Object.fromEntries(datosFormulario); 
        console.log(deporte)
        if (deporte.valor==""){
            deporte.valor=0
        }
        if (deporte.nombre==""){
            deporte.nombre=null
        }
        if (deporte.descripcion==""){
            deporte.descripcion=null
        }
        if (deporte.profesor==""){
            deporte.profesor=null
        }
        // Validación sencilla para campos vacíos

        var url = `${process.env.REACT_APP_DOMINIO_BACK}/admin/actividades/${id}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deporte),
        });

        if (response.status === 200) {
            const data = await response.json();
            setIdDeporte(data.id);
            setMensaje(data.msj + " Puede agregar imágenes si lo desea");
        } else {
            const data = await response.json();
            setError(true);
            setMensaje(data.msj);
        }
        e.target.reset(); // Limpiar el formulario
        
    };

    return (
        <div className="put-container">
            {!mensaje ? (
                <div className="put-card">
                    <h2 className="put-title">Actualizar deporte</h2>
                    <h3 className="">Lo que no complete, no se actualizara. No se permiten campos vacíos.</h3>
                    {/* Dropdown para seleccionar el deporte */}

                    {/* Formulario para actualizar deporte */}
                        <form onSubmit={consultarForm} ref={datForm} className="put-form">

                            <input
                                type="text"
                                className="put-input"
                                placeholder="Nombre"
                                name="nombre"
                            />
                            <textarea
                                className="put-textarea"
                                placeholder="Descripción"
                                name="descripcion"
                            />
                            <input
                                type="number"
                                className="put-input"
                                placeholder="Valor mensual"
                                name="valor"
                            />
                            <input
                                type="text"
                                className="put-input"
                                placeholder="Profesor a cargo"
                                name="profesor"
                            />
                            <button type="submit" className="put-button">Actualizar deporte</button>
                        </form>

                </div>
            ) : (!error ? (
                <div>
                    <Mensaje msj={mensaje} />
                    <ImagenPost actividad={true} id={idDeporte} />
                </div>
            ) : (
                <Mensaje msj={mensaje} />
            ))}
        </div>
    );
};