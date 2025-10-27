import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="content-section fade-in">
      <div className="text-center py-20">
        <div className="text-9xl mb-8">🤔</div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600 mb-6">Página No Encontrada</h2>
        <p className="text-xl text-gray-500 mb-10 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary text-lg px-8 py-4"
          >
            🏠 Ir al Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary text-lg px-8 py-4"
          >
            ⬅️ Página Anterior
          </button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Páginas Disponibles:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/invoices')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              📄 Facturas
            </button>
            <button
              onClick={() => navigate('/clients')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              👥 Clientes
            </button>
            <button
              onClick={() => navigate('/monitor')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              📡 Monitor Alanube
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              👤 Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}