import React, { useState } from 'react';
import './Propuestas.css';

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
    alert('Abrir modal o redirigir para agregar una propuesta nueva');
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

  return (
    <div className="propuestas-container">
      <h2>Propuestas</h2>
      
      <div className='button-container'>
        <button className="add-campaign-button" onClick={handleAddProposal}>
          Agregar Propuesta
        </button>
        <button className="add-campaign-button" onClick={handleDeleteProposal}>
          Eliminar Propuesta
        </button>
      </div>

        <select id="user-filter" value={selectedUser} onChange={handleUserFilterChange}>
          <option value="Todos">Todos</option>
          <option value="Usuario1">Usuario1</option>
          <option value="Usuario2">Usuario2</option>
          <option value="Usuario3">Usuario3</option>
        </select>

      <div className="propuestas-grid">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((propuesta) => (
            <div key={propuesta.id} className="propuesta-card">
              <h3>{propuesta.title}</h3>
              <p>{propuesta.description}</p>
              <p>Votos: {propuesta.votes}</p>
              <button
                className={`vote-button ${votes[propuesta.id] ? 'voted' : ''}`}
                onClick={() => handleVote(propuesta.id)}
              >
                {votes[propuesta.id] ? 'No votar' : 'Votar'}
              </button>
            </div>
          ))
        ) : (
          <p>No se encontraron propuestas</p>
        )}
      </div>
    </div>
  );
};