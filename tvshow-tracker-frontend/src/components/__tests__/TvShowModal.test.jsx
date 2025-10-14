import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TvShowModal from '../TvShowModal';

// Mock para evitar problemas com insertRule
beforeAll(() => {
  // Mock do document.styleSheets
  Object.defineProperty(document, 'styleSheets', {
    value: [{
      insertRule: jest.fn(),
      cssRules: []
    }],
    writable: true
  });
});

// Mock das dependências
jest.mock('../../contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    isFavorite: jest.fn().mockReturnValue(false),
  }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1 },
    isAuthenticated: true,
  }),
}));

const mockTvShow = {
  id: 1,
  title: 'Test TV Show',
  description: 'Test description',
  genre: 'Drama',
  type: 'Series',
  rating: 8.5,
  releaseDate: '2020-01-01',
  seasons: 3,
  duration: 45,
  imageUrl: 'test-image.jpg',
  episodes: [
    {
      id: 1,
      title: 'Episode 1',
      seasonNumber: 1,
      episodeNumber: 1,
      releaseDate: '2020-01-01',
      duration: '00:45:00',
      rating: 8.5
    }
  ],
  featuredActors: [
    {
      id: 1,
      name: 'Test Actor',
      characterName: 'Test Character'
    }
  ]
};

describe('TvShowModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('does not render when isOpen is false', () => {
    render(
      <TvShowModal 
        isOpen={false}
        onClose={mockOnClose}
        tvShow={mockTvShow}
      />
    );

    expect(screen.queryByText('Test TV Show')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <TvShowModal 
        isOpen={true}
        onClose={mockOnClose}
        tvShow={mockTvShow}
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays basic show information when open', () => {
    render(
      <TvShowModal 
        isOpen={true}
        onClose={mockOnClose}
        tvShow={mockTvShow}
      />
    );

    expect(screen.getByText('Test TV Show')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });
});
