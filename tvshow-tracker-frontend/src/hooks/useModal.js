import { useState } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data);
    setIsOpen(true);
    // Prevenir scroll do body quando modal estiver aberto
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null);
    // Restaurar scroll do body
    document.body.style.overflow = 'unset';
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal
  };
};

// ⚠️ IMPORTANTE: Exportação como default
export default useModal;