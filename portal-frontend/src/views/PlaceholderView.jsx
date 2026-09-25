import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PlaceholderView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const title = location.pathname
    .replace('/', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="h-full flex flex-col bg-[#f9f9f9]">
      <div className="flex flex-col border-b border-gray-200 px-4 py-3 bg-white sticky top-0 z-10 shrink-0">
        <div className="flex items-center text-lg text-gray-700">
          <span className="cursor-pointer hover:underline text-[#714B67]" onClick={() => navigate('/dashboard')}>Aplicaciones</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{title || 'Módulo'}</span>
        </div>
      </div>
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-tools text-4xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-light text-gray-800 mb-3">{title || 'Módulo'} no instalado</h2>
          <p className="text-gray-500 mb-8 text-sm">Esta aplicación o módulo aún no se encuentra configurado o instalado en su entorno. Por favor, contacte a su administrador de sistema.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#714B67] hover:bg-[#5a3c52] text-white px-5 py-2 rounded text-sm font-medium transition-colors shadow-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderView;
