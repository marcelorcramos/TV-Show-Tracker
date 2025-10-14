import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock do TvShowModal ANTES de importar TvShowCard
jest.mock('../TvShowModal', () => {
  return function MockTvShowModal({ isOpen, data, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="tvshow-modal">
        Mock TvShowModal - {data?.title}
      </div>
    );
  };
});

// Mock dos hooks
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 1, name: 'Test User', email: 'test@example.com' },
  }),
}));

jest.mock('../../contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    isFavorite: jest.fn().mockReturnValue(false),
  }),
}));

jest.mock('../../hooks/useModal', () => ({
  __esModule: true,
  default: () => ({
    isOpen: false,
    modalData: null,
    openModal: jest.fn(),
    closeModal: jest.fn(),
  }),
}));

// Agora importar o componente após os mocks
import TvShowCard from '../TvShowCard';

// Wrapper para componentes que usam React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('TvShowCard', () => {
  const mockTvShow = {
    id: 1,
    title: 'Test TV Show',
    genre: 'Drama',
    type: 'Series',
    rating: 8.5,
    releaseDate: '2020-01-01',
    imageUrl: 'test-image.jpg',
    description: 'Test description',
    featuredActors: [
      { id: 1, name: 'Actor 1', characterName: 'Character 1' },
      { id: 2, name: 'Actor 2', characterName: 'Character 2' }
    ]
  };

  test('renders TV show card with correct information', () => {
    render(
      <RouterWrapper>
        <TvShowCard tvShow={mockTvShow} />
      </RouterWrapper>
    );

    expect(screen.getByText('Test TV Show')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
    expect(screen.getByText('Series')).toBeInTheDocument();
    
    // Corrigido: usar uma função para buscar o texto quebrado
    const ratingElement = screen.getByText((content, element) => {
      return element.textContent === '⭐ 8.5/10' || content === '8.5';
    });
    expect(ratingElement).toBeInTheDocument();
  });

  test('renders featured actors', () => {
    render(
      <RouterWrapper>
        <TvShowCard tvShow={mockTvShow} />
      </RouterWrapper>
    );

    expect(screen.getByText('Actor 1')).toBeInTheDocument();
    expect(screen.getByText('Actor 2')).toBeInTheDocument();
  });

  test('renders favorite button when authenticated', () => {
    render(
      <RouterWrapper>
        <TvShowCard tvShow={mockTvShow} />
      </RouterWrapper>
    );

    const favoriteButton = screen.getByTitle('Add to favorites');
    expect(favoriteButton).toBeInTheDocument();
  });

  test('shows details button', () => {
    render(
      <RouterWrapper>
        <TvShowCard tvShow={mockTvShow} />
      </RouterWrapper>
    );

    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });

  test('handles movie type correctly', () => {
    const movieTvShow = { 
      ...mockTvShow, 
      type: 'Movie',
      duration: 120,
      imageUrl: null
    };
    
    render(
      <RouterWrapper>
        <TvShowCard tvShow={movieTvShow} />
      </RouterWrapper>
    );

    expect(screen.getByText('Movie')).toBeInTheDocument();
  });

  test('handles series type correctly', () => {
    const seriesTvShow = { 
      ...mockTvShow, 
      type: 'Series',
      seasons: 3,
      imageUrl: null
    };
    
    render(
      <RouterWrapper>
        <TvShowCard tvShow={seriesTvShow} />
      </RouterWrapper>
    );

    expect(screen.getByText('Series')).toBeInTheDocument();
  });
});
