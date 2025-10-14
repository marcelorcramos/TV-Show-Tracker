import { useState } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null);
    document.body.style.overflow = 'unset';
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal
  };
};

export default useModal;