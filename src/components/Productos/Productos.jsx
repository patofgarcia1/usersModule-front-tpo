import React from 'react';
import './Productos.css';
import "../Global.css";

const productos = [
  { id: 1, name: 'Crocs Crocband Clog', price: '$40.862', imageUrl: 'link-to-image', tipo: 'Calzado' },
  { id: 2, name: 'Crocs Classic Originales', price: '$32.990', imageUrl: 'link-to-image', tipo: 'Calzado' },
  { id: 3, name: 'Sandalias Mujer Taco Bajo', price: '$24.900', imageUrl: 'link-to-image', tipo: 'Sandalias' },
  { id: 4, name: 'Ojotas Adidas Shower', price: '$39.999', imageUrl: 'link-to-image', tipo: 'Ojotas' },
  { id: 5, name: 'Crocs Azul Unisex', price: '$44.990', imageUrl: 'link-to-image', tipo: 'Calzado' },
  // Agrega más productos según necesites
];

// Función para agrupar productos por tipo
const groupByType = (products) => {
  return products.reduce((group, product) => {
    const { tipo } = product;
    if (!group[tipo]) {
      group[tipo] = [];
    }
    group[tipo].push(product);
    return group;
  }, {});
};

export const Productos = () => {
  const productosPorTipo = groupByType(productos);

  return (
    <div className="productos-container">
      <div className="search-container">
        <input type="text" placeholder="Buscar productos..." className="search-bar" />
      </div>
      {Object.keys(productosPorTipo).map(tipo => (
        <div key={tipo} className="tipo-seccion">
          <h2 className="tipo-titulo">{tipo}</h2>
          <div className="productos-grid">
            {productosPorTipo[tipo].map(producto => (
              <div key={producto.id} className="producto-card">
                <img src={producto.imageUrl} alt={producto.name} className="producto-image" />
                <div className="producto-info">
                  <p className="producto-name">{producto.name}</p>
                  <p className="producto-price">{producto.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};