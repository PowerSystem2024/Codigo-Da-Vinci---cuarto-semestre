import React from 'react'
import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

function HomePage() {
  
  // Llamamos a useContext para "agarrar" los valores del provider
  const { user, isAuth, errors } = useContext(AuthContext);

  // Ahora podés ver los datos en la consola
  console.log("Datos del contexto:", user, isAuth);

  return (
    <div>
      <h1>HomePage</h1>
      
      {/* O podés mostrarlos en la página para ver que funciona */}
      <h2>Usuario: {user ? user.name : "No logueado"}</h2>
      <p>Autenticado: {isAuth ? "Sí" : "No"}</p>
    </div>
  );
}
export default HomePage