// src/components/ActorCard.jsx
import React from 'react';

export const ActorCard = ({ actor }) => {
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatBirthDate = (birthDate) => {
    return new Date(birthDate).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Header com imagem/avatar */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex justify-center items-center">
        {actor.imageUrl ? (
          <img 
            src={actor.imageUrl} 
            alt={actor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <span className="text-blue-600 text-2xl font-bold">
              {actor.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Informações do ator */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {actor.name}
        </h3>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">🏴 Nacionalidade:</span>
            <span>{actor.nationality || 'Não informada'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">🎂 Idade:</span>
            <span>{calculateAge(actor.birthDate)} anos</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">📅 Nascimento:</span>
            <span>{formatBirthDate(actor.birthDate)}</span>
          </div>
        </div>

        {/* Bio */}
        {actor.bio && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-3">
              {actor.bio}
            </p>
          </div>
        )}

        {/* Botão de ação */}
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
            Ver Perfil
          </button>
          <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
            ☆
          </button>
        </div>
      </div>
    </div>
  );
};