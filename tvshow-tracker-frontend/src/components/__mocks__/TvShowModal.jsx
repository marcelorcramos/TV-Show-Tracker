import React from 'react';

// Mock simplificado do TvShowModal para testes
const TvShowModal = ({ isOpen, data, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div data-testid="tvshow-modal">
      Mock TvShowModal - {data?.title}
    </div>
  );
};

export default TvShowModal;
