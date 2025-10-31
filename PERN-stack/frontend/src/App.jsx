import React from 'react';
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TareasPage from './pages/TareasPage';
import TareaFormPage from './pages/TareaFormPage';
import NotFound from './pages/NotFound';

import { useAuth } from './context/AuthContext'; // 1. IMPORTAMOS useAuth

function App() {
  
  const { loading, isAuth } = useAuth(); // 2. OBTENEMOS 'loading'

  // 3. SI ESTÁ CARGANDO, MOSTRAMOS UN MENSAJE
  if (loading) {
    return <h1>Cargando...</h1>;
  }

  // 4. SI YA TERMINÓ DE CARGAR, MOSTRAMOS LAS RUTAS
  return (
    <Routes> 
      <Route path="/" element={<HomePage/>} />
      <Route path="/about" element={<AboutPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />

      {/* Si 'isAuth' es true, protegemos estas rutas.
        (Esto es el siguiente paso, pero por ahora las dejamos abiertas)
      */}
      <Route path="/perfil" element={<ProfilePage/>} />
      <Route path="/tareas" element={<TareasPage/>} />
      <Route path="/tareas/create" element={<TareaFormPage/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}

export default App;