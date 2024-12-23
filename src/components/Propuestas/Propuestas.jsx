import React, { useEffect, useState } from 'react';
import './Propuestas.css';
import { useSelector } from 'react-redux';
import { getToken, isTokenExpired } from '../../utils/auth-utils';
import { useNavigate } from 'react-router-dom';

const initialPropuestas = [
  { id: 1, title: 'Nueva cancha de fútbol 5', description: 'Construcción de una cancha de césped sintético para entrenamientos.', votes: 124, createdBy: 'Usuario1' },
  { id: 2, title: 'Reforma del gimnasio', description: 'Renovación del gimnasio del club con nuevo equipamiento.', votes: 98, createdBy: 'Usuario2' },
  { id: 3, title: 'Renovación de vestuarios', description: 'Mejorar las instalaciones del vestuario para el equipo y los socios.', votes: 76, createdBy: 'Usuario1' },
  { id: 4, title: 'Instalación de paneles solares', description: 'Incorporar paneles solares para hacer el club más ecológico.', votes: 85, createdBy: 'Usuario3' },
];

export const Propuestas = () => {
  const [currentProposals, setCurrentProposals] = useState(initialPropuestas);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('Todos');
  const [votes, setVotes] = useState({}); // Stores user votes
  const navigate = useNavigate(); // Hook para navegar

  const admin = useSelector((state) => state.usuarios.isAdmin);

  const dni = useSelector((state) => state.usuarios.dni);

  const [listaPropuestas,setListaPropuestas]= useState([]);
  const [mensaje,setMensaje]= useState(null);

  const [loading, setLoading] = useState(true);
 

  const ejecutarFetch = async() =>{

    let url;
    if (admin!=true){
      url=`misPropuestas/${dni}`
    }else{
      url=`admin/propuestas`
    }

    try {
        const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/${url}`, {
          
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${getToken()}`
          }
          
        })
        if (response.status==403){
          if (isTokenExpired(getToken())) {
            alert("Venció su sesión. Vuelva a logguearse")
            navigate("/logout")
          }
        }
        const data = await response.json()
        if (data.msj){
          console.log(data.msj)

          setListaPropuestas([])
          setMensaje(data.msj)
        //  alert("este usr no tiene campañas. msj temporal")
        }else{
          console.log(data)
          setListaPropuestas(data)
        }
      } catch (error) {
          console.error('Error al cargar noticias:', error);
      } finally {
          setLoading(false);
      }
    }
 // }


  useEffect(() => { 
    ejecutarFetch()
    .catch(error => console.error(error))

  },[])



  const handleVote = (id) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [id]: !prevVotes[id] // Toggle vote
    }));
    setCurrentProposals((prevProposals) =>
      prevProposals.map((propuesta) =>
        propuesta.id === id
          ? { ...propuesta, votes: votes[id] ? propuesta.votes - 1 : propuesta.votes + 1 } // Increase or decrease votes
          : propuesta
      )
    );
  };

  const handleAddProposal = () => {
    navigate("/propuestas/add")
  };

  const handleDeleteProposal = () => {
    alert('Abrir modal o redirigir para eliminar una propuesta nueva');
  };


  const handleUserFilterChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const filteredProposals = currentProposals
    .filter((propuesta) =>
      propuesta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propuesta.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((propuesta) => selectedUser === 'Todos' || propuesta.createdBy === selectedUser);


    if (loading) {
      return (
          <div className="propuestas-loading-overlay">
              <div className="spinner"></div>
              <p>Cargando...</p>
          </div>
      );
  }

  return (
    <div className="propuestas-container">
      {admin?<h2>Propuestas</h2>:<h2>Mis Propuestas</h2>}
      
      <div className='button-container'>
        {!admin&&
          <button className="add-campaign-button" onClick={handleAddProposal}>
          Agregar Propuesta
        </button>
        }
        {/*
          <button className="add-campaign-button" onClick={handleDeleteProposal}>
          Eliminar Propuesta
        </button>*/
        }
      </div>

        {/*
        <select id="user-filter" value={selectedUser} onChange={handleUserFilterChange}>
          <option value="Todos">Todos</option>
          <option value="Usuario1">Usuario1</option>
          <option value="Usuario2">Usuario2</option>
          <option value="Usuario3">Usuario3</option>
        </select>
        */
        }
   

      <div className="propuestas-grid">
        {listaPropuestas.length > 0 ? (
          listaPropuestas.map((propuesta) => (
            <div key={propuesta.id} className="propuesta-card">
              <h3>{propuesta.titulo}</h3>
              <p>{propuesta.descripcion}</p>
            <p>{propuesta.fechaPublicacion}</p>
            <p>Creada por: {propuesta.dni}</p>

            </div>
          ))
        ) : (
          <p>No se encontraron propuestas</p>
        )}
      </div>
    </div>
  );
};
