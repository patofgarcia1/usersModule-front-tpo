import "./SuperAdmin.css";
import { useState } from "react";
import { getToken, isTokenExpired } from "../../utils/auth-utils";
import { useNavigate } from "react-router-dom";

const SuperAdmin = () => {
  const [formData, setFormData] = useState({
    dni: null,
    password: "",
    nombre:"",
    apellido:"",
    rol: "Directivo",
  });
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username=formData.nombre.substr(0,1)+formData.apellido.substr(0,1)+formData.dni
    const newObj={...formData,username}
 
    const response = await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`, 
      },
      body: JSON.stringify(newObj),
    });
    if (response.status==403){
      if (isTokenExpired(getToken())) {
        alert("Venció su sesión. Vuelva a logguearse")
        navigate("/logout")
      }
    }
    const data = await response.json();

 
    e.target.reset();
    setMensaje(data.msj);
    alert(`${mensaje}`)


  };

  return (
    <div className="superadmin-container">
      <div className="superadmin-form">
        <h3>Super Admin</h3>
        {mensaje && <p>{mensaje}</p>}
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              name="apellido"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dni">DNI</label>
            <input
              type="number"
              name="dni"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              required
            >
              <option value="Directivo">Directivo</option>
              <option value="Inversionista">Inversionista</option>
              <option value="Cliente">E-Commerce</option>
              <option value="Activo">Socio Activo</option>
              <option value="Patrimonial">Socio Patrimonial</option>
            </select>
          </div>

          <button type="submit" className="button btnPrimary">
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export { SuperAdmin };
