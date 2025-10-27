import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const token = localStorage.getItem('token');
  
  // Si hay token, ir al dashboard; si no, ir al login
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}