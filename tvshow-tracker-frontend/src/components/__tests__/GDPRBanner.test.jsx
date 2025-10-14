import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GDPRBanner from '../GDPRBanner';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('GDPRBanner Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('renders banner when GDPR is not accepted', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<GDPRBanner />);
    
    expect(screen.getByText(/We use cookies/)).toBeInTheDocument();
    expect(screen.getByText('Accept Cookies')).toBeInTheDocument();
  });

  test('does not render when GDPR is already accepted', () => {
    localStorageMock.getItem.mockReturnValue('true');
    
    render(<GDPRBanner />);
    
    expect(screen.queryByText(/We use cookies/)).not.toBeInTheDocument();
  });

  test('hides banner when accept button is clicked', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<GDPRBanner />);
    
    const acceptButton = screen.getByText('Accept Cookies');
    fireEvent.click(acceptButton);
    
    // Verifica se qualquer uma das chaves foi definida
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(screen.queryByText(/We use cookies/)).not.toBeInTheDocument();
  });

  test('privacy policy link has correct href', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<GDPRBanner />);
    
    const privacyLink = screen.getByText('Privacy Policy');
    expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
  });
});
