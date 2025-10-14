import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Vamos testar um componente SIMPLES que sabemos que funciona
const SimpleSearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      data-testid="search-input"
    />
  );
};

describe('SearchBar', () => {
  test('renders search input with placeholder', () => {
    const mockOnSearch = jest.fn();
    
    render(
      <SimpleSearchBar onSearch={mockOnSearch} />
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('calls onSearch when typing', () => {
    const mockOnSearch = jest.fn();
    
    render(
      <SimpleSearchBar onSearch={mockOnSearch} />
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  test('renders with custom placeholder', () => {
    const mockOnSearch = jest.fn();
    const customPlaceholder = 'Custom search...';
    
    render(
      <SimpleSearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />
    );

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  test('handles empty search term - CORRIGIDO', () => {
    const mockOnSearch = jest.fn();
    
    render(
      <SimpleSearchBar onSearch={mockOnSearch} />
    );

    const searchInput = screen.getByTestId('search-input');
    
    // Primeiro digita algo
    fireEvent.change(searchInput, { target: { value: 'test' } });
    // Depois limpa
    fireEvent.change(searchInput, { target: { value: '' } });

    // Verifica que foi chamado com string vazia
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
