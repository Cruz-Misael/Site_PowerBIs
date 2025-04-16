import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserDashboard from '../../components/UserDashboard';
import '@testing-library/jest-dom';

// Mock do fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, title: 'Dashboard 1', url: 'http://exemplo.com' }]),
  })
);

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('UserDashboard - Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.removeItem.mockReset();
  });

  // Teste 1: Carrega dashboards da API ao montar
  it('deve carregar dashboards da API', async () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('user@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/dashboard/team/Dev Team`);
      expect(screen.getByText('Dashboard 1')).toBeInTheDocument();
    });
  });

  // Teste 2: Navega para /user-settings se admin
  it('deve navegar para /user-settings se for admin', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('user@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    const { container } = render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Configurações'));
    expect(container.innerHTML).toContain('/user-settings'); // Verifica se o router atualizou
  });

  // Teste 3: Logout remove credenciais e navega
  it('deve fazer logout corretamente', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('user@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    const { container } = render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Sair'));
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userEmail');
    expect(container.innerHTML).toContain('/login');
  });
});