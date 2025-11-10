import React from 'react';
import { Navigate } from 'react-router-dom';

// Função para checar se o token existe e é válido (opcional validar expiração)
const isAuthenticated = () => {
  const token = localStorage.getItem('access');
  return !!token; // retorna true se o token existir
};

// Componente de rota protegida
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
