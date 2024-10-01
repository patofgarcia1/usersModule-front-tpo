import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import './Usuarios.css';
import { useNavigate } from 'react-router-dom';


export const Usuarios= () => {
  const [selectedSubject, setSelectedSubject] = useState('Todos');

  const dni=111
  const navigate = useNavigate();
  const admin = useSelector((state) => state.usuarios.isAdmin);

  const [listaUsuarios,setListaUsuarios]= useState([]);
  const [mensaje,setMensaje]= useState(null);

  const [selectedRol, setSelectedRol] = useState("");

  const [listaRoles,setListaRoles]= useState([
    "Inversor","Activo","Patrimonial","Directivo","Comprador"
  ]);

  //falta desarrollar filtros en el back
  const getRoles = async() =>{

    const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/roles`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${getToken()}`
      }
      
    })

    const data = await response.json()
    console.log(data)
    if (data.msj){
      setMensaje(data.msj)
    }else{
      setListaRoles(data)
    }
  }

  const ejecutarFetch = async() =>{

    let url;
    url=`admin/usuarios?rol=${selectedRol}`
 
    console.log(url)
    const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/${url}`, { 
      method: "GET",
      headers: {
          "Content-Type": "application/json",
         // "Authorization": `Bearer ${getToken()}`
      }
      
    })
 
    const data = await response.json()
    if (data.msj){
      setListaUsuarios([])
      setMensaje(data.msj)
    }else{
      console.log(data)
      setListaUsuarios(data)
    }
    }



  useEffect(() => { 
    ejecutarFetch()
    .catch(error => console.error(error))

  },[selectedRol])

  useEffect(() => { 
    getRoles()
    .catch(error => console.error(error))

  },[])


  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };


  const handleAgregar= () => {
    alert('Abrir modal o redirigir para Agregar un nuevo usuario');
  };


  return (
    <div className="usuario-container">
      <h2 className="usuario-title">Lista de Usuarios</h2>
      {admin&&
        <button className="add-usuario-button" onClick={handleAgregar}>
        Agregar Usuario
      </button>
      }
      <div className="usuario-filter">
      <label htmlFor="subject">Selecciona el Rol:</label>
        <select
          id="subject"
          value={selectedRol}
          onChange={(e) => setSelectedRol(e.target.value)}
          required
        >
          <option value={""}>
            Mostrar todos
          </option>
          {listaRoles.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>
      {listaUsuarios.length!=0?<div className="usuario-scroll">
        {listaUsuarios.map(usuario => (
          <div key={usuario.dni} className="usuario-item">
            
            <div className="usuario-user">{usuario.nombre} {usuario.apellido}    -    DNI: {usuario.dni}</div>
            <p className="usuario-comment">{usuario.rol}</p>
            <button onClick={() => navigate(`/usuarios/${usuario.dni}`)} className="add-usuario-button">
              Ver Usuario
            </button>
          </div>
        ))}
      </div>:
      <div className="usuario-scroll">
      
        <div className="usuario-item">
          
          <div className="usuario-user">No hay usuarios para el rol filtrado</div>
          <p className="usuario-comment">¡Pruebe con otro!</p>
        </div>
      </div>
      }
    </div>
  );
};