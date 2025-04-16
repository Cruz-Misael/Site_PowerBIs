import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserDashboard from '../../components/UserDashboard';
import '@testing-library/jest-dom';

// Mocks globais
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock do window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

describe('UserDashboard - Unit Tests', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.removeItem.mockReset();
    mockWindowOpen.mockReset();
  });

  // Teste 1: Redireciona para /login se não houver dados no localStorage
  it('deve navegar para /login se localStorage estiver vazio', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null); // userEmail
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(<UserDashboard />);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // Teste 2: Exibe dados do usuário quando localStorage está preenchido
  it('deve exibir email e time do usuário', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('user@test.com') // userEmail
      .mockReturnValueOnce('Admin') // accessLevel
      .mockReturnValueOnce('Dev Team'); // team

    render(<UserDashboard />);
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
    expect(screen.getByText('DASHBOARDS: Dev Team /')).toBeInTheDocument();
  });

  // Teste 3: Botão de logout limpa localStorage e navega
  it('deve limpar localStorage e navegar ao clicar em Sair', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(<UserDashboard />);
    fireEvent.click(screen.getByText('Sair'));

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userEmail');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // Teste 4: Acesso negado para não-admins em Configurações
  it('deve mostrar alerta se não-admin clicar em Configurações', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('user@test.com')
      .mockReturnValueOnce('User') // Não-admin
      .mockReturnValueOnce('Dev Team');

    global.alert = jest.fn();
    render(<UserDashboard />);
    fireEvent.click(screen.getByText('Configurações'));

    expect(global.alert).toHaveBeenCalledWith(
      'Acesso negado! Apenas administradores podem acessar a página de configurações.'
    );
  });

  // Teste 5: Abre URL em fullscreen
  it('deve chamar window.open ao clicar em um card', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('user@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    // Mock do estado dashboards
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [
      [{ id: 1, title: 'Dashboard 1', url: 'http://exemplo.com' }],
      jest.fn(),
    ]);

    render(<UserDashboard />);
    fireEvent.click(screen.getByText('Dashboard 1'));
    expect(mockWindowOpen).toHaveBeenCalledWith('http://exemplo.com', '_blank', 'fullscreen=yes');
  });
});