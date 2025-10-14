import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ActorCard from '../ActorCard';

// Mock do AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 1, name: 'Test User', email: 'test@example.com' },
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock do useModal
jest.mock('../../hooks/useModal', () => ({
  __esModule: true,
  default: () => ({
    isOpen: false,
    modalData: null,
    openModal: jest.fn(),
    closeModal: jest.fn(),
  }),
}));

// Mock do ActorModal
jest.mock('../ActorModal', () => {
  return function MockActorModal({ isOpen, data, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="actor-modal">
        Mock ActorModal - {data?.name}
      </div>
    );
  };
});

// Mock da API para evitar chamadas de rede
jest.mock('../../services/api', () => ({
  actorsAPI: {
    getTvShows: jest.fn().mockResolvedValue([]),
  },
}));

// Wrapper para componentes que usam React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('ActorCard', () => {
  const mockActor = {
    id: 1,
    name: 'Test Actor',
    nationality: 'American',
    birthDate: '1980-01-01',
    bio: 'Test biography',
    imageUrl: 'test-actor.jpg'
  };

  test('renders actor card with correct information', () => {
    render(
      <RouterWrapper>
        <ActorCard actor={mockActor} />
      </RouterWrapper>
    );

    // Usar getAllByText para múltiplos elementos
    const actorNames = screen.getAllByText('Test Actor');
    expect(actorNames.length).toBeGreaterThan(0);
    
    expect(screen.getByText('American')).toBeInTheDocument();
    expect(screen.getByText('Test biography')).toBeInTheDocument();
  });

  test('renders actor age when birthDate is provided', () => {
    render(
      <RouterWrapper>
        <ActorCard actor={mockActor} />
      </RouterWrapper>
    );

    // Deve calcular a idade baseada na data de nascimento
    expect(screen.getByText(/\d+ years old/)).toBeInTheDocument();
  });

  test('handles missing image gracefully', () => {
    const actorWithoutImage = { ...mockActor, imageUrl: null };
    
    render(
      <RouterWrapper>
        <ActorCard actor={actorWithoutImage} />
      </RouterWrapper>
    );

    expect(screen.getByText('🎭')).toBeInTheDocument();
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  test('shows details button', () => {
    render(
      <RouterWrapper>
        <ActorCard actor={mockActor} />
      </RouterWrapper>
    );

    // O botão agora é "Show Details" em vez de "View Details"
    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });

  test('renders without birth date', () => {
    const actorWithoutBirthDate = { ...mockActor, birthDate: null };
    
    render(
      <RouterWrapper>
        <ActorCard actor={actorWithoutBirthDate} />
      </RouterWrapper>
    );

    // Usar getAllByText para múltiplos elementos
    const actorNames = screen.getAllByText('Test Actor');
    expect(actorNames.length).toBeGreaterThan(0);
    
    expect(screen.queryByText(/years old/)).not.toBeInTheDocument();
  });
});
