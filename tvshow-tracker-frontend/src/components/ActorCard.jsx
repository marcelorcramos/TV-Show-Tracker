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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="flex items-start space-x-4">
        {/* Avatar do Ator */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {actor.imageUrl ? (
              <img 
                src={actor.imageUrl} 
                alt={actor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-blue-600 text-xl font-bold">
                {actor.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
        
        {/* Informações do Ator */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {actor.name}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              {actor.nationality}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              {calculateAge(actor.birthDate)} anos
            </span>
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2">
            {actor.bio}
          </p>
          
          {/* Data de Nascimento */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Nascimento: {new Date(actor.birthDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};