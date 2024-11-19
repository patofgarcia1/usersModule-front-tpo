import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Reclamos.css';

import foto from './CanchaSanLorenzo.jpg';

const reclamos = [
  { 
    id: 1, 
    usuario: 'A', 
    tipoReclamo: 'Mantenimiento', 
    fecha: '2024-09-10T08:30:00Z', 
    premisa: 'Problemas de mantenimiento en el club', 
    comentario: 'Hay muchas áreas en el club que necesitan mantenimiento.', 
    imagen: foto,
    estado: 'Pendiente' 
  },
  { 
    id: 2, 
    usuario: 'B', 
    tipoReclamo: 'Precios', 
    fecha: '2024-09-11T10:00:00Z', 
    premisa: 'Precios altos en la cafetería', 
    comentario: 'Los precios en la cafetería son muy altos.', 
    imagen: foto,
    estado: 'En revisión' 
  },
  { 
    id: 3, 
    usuario: 'C', 
    tipoReclamo: 'Entrenadores', 
    fecha: '2024-09-12T11:15:00Z', 
    premisa: 'Calidad de entrenadores', 
    comentario: 'La calidad de los entrenadores es baja.', 
    imagen: foto,
    estado: 'Resuelto' 
  },
  { 
    id: 4, 
    usuario: 'D', 
    tipoReclamo: 'Iluminación', 
    fecha: '2024-09-13T18:45:00Z', 
    premisa: 'Iluminación insuficiente en estacionamiento', 
    comentario: 'La iluminación en el estacionamiento es insuficiente.', 
    imagen: foto,
    estado: 'Pendiente' 
  },
  { 
    id: 5, 
    usuario: 'E', 
    tipoReclamo: 'Estacionamiento', 
    fecha: '2024-09-14T20:00:00Z', 
    premisa: 'Falta de espacio de estacionamiento durante eventos', 
    comentario: 'Es difícil encontrar estacionamiento durante los eventos.', 
    imagen: foto,
    estado: 'En revisión' 
  },
];

export const Reclamos = () => {
  const [selectedRubro, setSelectedRubro] = useState('Todos');
  const [reclamos, setReclamos] = useState(false);
  
  //const usuarioActual = useSelector((state) => state.usuarios.usuarioActual); // Usuario actual
  const isAdmin = useSelector((state) => state.usuarios.admin);
  const usuarioActual = "A"; // Usuario actual
  const admin = useSelector((state) => state.usuarios.isAdmin); // Verifica si es admin
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const handleAddReclamo = () => {
    navigate('/reclamo');
  };

  const handleRubroChange = (e) => {
    setSelectedRubro(e.target.value);
  };

  // Filtrar reclamos por usuario actual y por rubro
 /*const filteredReclamos = reclamos.filter(reclamo => {
    if (admin) {
      // Si es admin, muestra todos los reclamos filtrados por el rubro seleccionado
      const esRubroValido = selectedRubro === 'Todos' || reclamo.tipoReclamo === selectedRubro;
      return esRubroValido;
    } else {
      // Si no es admin, muestra solo los reclamos del usuario actual filtrados por el rubro seleccionado
      const esMiReclamo = reclamo.usuario === usuarioActual; // Solo reclamos del usuario actual
      const esRubroValido = selectedRubro === 'Todos' || reclamo.tipoReclamo === selectedRubro;
      return esMiReclamo && esRubroValido;
    }
  });*/
  const [error, setError] = useState(null);  // Estado para manejar errores

  useEffect(() => {
      // Conectar al WebSocket en el endpoint /ws
      const socket = new WebSocket('ws://localhost:8080/ws');
      // Al abrir la conexión WebSocket
      socket.onopen = () => {
          console.log("Conexión WebSocket establecida.");
          // Enviar un mensaje al servidor si es necesario (por ejemplo, para pedir productos)
          socket.send("Solicitar mis Reclamos");
      };
      // Manejar el mensaje recibido del servidor
      socket.onmessage = (event) => {
          console.log("Mensaje recibido: ", event.data);
          try {
              // Deserializar el JSON de productos
              const misReclamos = JSON.parse(event.data);
              
              // Verificar que la respuesta sea un array de productos
              if (Array.isArray(misReclamos)) {
                misReclamos.forEach(producto=>{
                  producto.image=foto
                })
                  setReclamos(misReclamos);  // Actualizar el estado de productos
              } else {
                  throw new Error("Las Reclamos no están en el formato esperado.");
              }

              setLoading(false);  // Marcar como "cargado" una vez que los productos llegan
          } catch (e) {
              console.error("Error al procesar las Reclamos: ", e);
              setError("Error al recibir las Reclamos .");  // Mostrar un mensaje de error
              setLoading(false);  // Cambiar el estado de carga
          }
      };

      // Manejar errores en la conexión WebSocket
      socket.onerror = (error) => {
          console.error("Error en WebSocket: ", error);
          setError("Error en la conexión WebSocket.");
          setLoading(false);  // Cambiar el estado de carga en caso de error
      };

      // Manejar el cierre de la conexión WebSocket
      socket.onclose = () => {
          console.log("Conexión WebSocket cerrada.");
      };

      // Limpiar al desmontar el componente
      return () => {
          socket.close();
      };
  }, []);  // Este efecto se ejecuta una sola vez cuando el componente se monta

  if (loading) {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Cargando...</p>
        </div>
    );
}

  return (
    <div className="reclamo-container">
      <h2 className="reclamos-header">{isAdmin ? "Lista de Reclamos" : "Mis Reclamos"}</h2>
      
      {!admin && (
        <button className="reclamo-add-button" onClick={handleAddReclamo}>
          Agregar Reclamo
        </button>
      )}
      
      <div className="reclamo-filter">
        <label htmlFor="rubro">Selecciona el rubro:</label>
        <select
          id="rubro"
          value={selectedRubro}
          onChange={handleRubroChange}
        >
          <option value="Todos">Mostrar todos</option>
          <option value="Mantenimiento">Mantenimiento</option>
          <option value="Precios">Precios</option>
          <option value="Entrenadores">Entrenadores</option>
          <option value="Iluminación">Iluminación</option>
          <option value="Estacionamiento">Estacionamiento</option>
        </select>
        
        
      </div>

      <div className="reclamo-scroll">
        {//filteredReclamos.length !== 0 ? (
          //filteredReclamos.map(reclamo => (
            reclamos&&reclamos.map(reclamo => (
            <div key={reclamo.id} className="reclamo-item">
              <p className="reclamo-user">Usuario: {reclamo.usuario}</p>
              <div className="reclamo-tipo">Tipo: {reclamo.tipoReclamo}</div>
              <p className="reclamo-premisa">Estado: {reclamo.estado}</p>
              <p className="reclamo-premisa">{reclamo.fecha}</p>
              <p className="reclamo-premisa">Premisa: {reclamo.premisa}</p>
              <p className="reclamo-comentario">Comentario: {reclamo.comentario}</p>
              <img src={reclamo.imagen} alt="Reclamo" className="reclamo-imagen" />
            </div>
          ))
        //) 
        /*: (
          <div className="reclamo-item">
            <div className="reclamo-user">No hay reclamos para el filtro seleccionado</div>
            <p className="reclamo-comment">¡Prueba con otro filtro!</p>
          </div>
        )*/
          }
      </div>
    </div>
  );
};