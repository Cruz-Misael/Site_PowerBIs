import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserDashboard from '../../components/UserDashboard';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock do react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock do fetch
global.fetch = jest.fn();

// Mock do window.open
global.window.open = jest.fn();

// Mock do window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('UserDashboard - Testes de Integração', () => {
  const mockNavigate = jest.fn();
  const mockDashboards = [
    { id: 1, title: 'Dashboard 1', description: 'Descrição 1', url: 'https://example.com/dash1' },
    { id: 2, title: 'Dashboard 2', description: 'Descrição 2', url: 'https://example.com/dash2' },
  ];

  beforeEach(() => {
    // Configura mocks
    useNavigate.mockReturnValue(mockNavigate);
    fetch.mockClear();
    mockNavigate.mockClear();
    mockAlert.mockClear();
    window.open.mockClear();

    // Define valores padrão no localStorage
    localStorage.setItem('userEmail', 'user@example.com');
    localStorage.setItem('accessLevel', 'User');
    localStorage.setItem('team', 'Team A');
  });

  afterEach(() => {
    // Limpa o localStorage após cada teste
    localStorage.clear();
  });

    it('deve renderizar a tela com informações do usuário e dashboards', async () => {
        // Mock da chamada ao fetch para retornar dashboards
        fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboards,
        });
    
        render(<UserDashboard />);
    
        // Aguarda o carregamento dos dashboards
        await waitFor(() => {
        // Verifica informações do usuário
        expect(screen.getByText(/user@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/Team A/i)).toBeInTheDocument();
    
        // Verifica os dashboards
        expect(screen.getByText('Dashboard 1')).toBeInTheDocument();
        expect(screen.getByText('Descrição 1')).toBeInTheDocument();
        expect(screen.getByText('Dashboard 2')).toBeInTheDocument();
        expect(screen.getByText('Descrição 2')).toBeInTheDocument();
        });
    });

    it('deve navegar para a página de login ao clicar no botão Sair', async () => {
        // Mock da chamada ao fetch (necessário para renderizar a tela)
        fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        });
    
        render(<UserDashboard />);
    
        // Aguarda a renderização inicial
        await waitFor(() => {
        expect(screen.getByText(/user@example.com/i)).toBeInTheDocument();
        });
    
        // Clica no botão "Sair"
        fireEvent.click(screen.getByRole('button', { name: /Sair/i }));
    
        // Verifica se o localStorage foi limpo
        expect(localStorage.getItem('userEmail')).toBeNull();
        expect(localStorage.getItem('accessLevel')).toBeNull();
        expect(localStorage.getItem('team')).toBeNull();
    
        // Verifica se a navegação para /login foi chamada
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });


    it('deve exibir alerta de acesso negado ao clicar em Configurações sem permissão de admin', async () => {
        // Mock da chamada ao fetch (necessário para renderizar a tela)
        fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        });
    
        render(<UserDashboard />);
    
        // Aguarda a renderização inicial
        await waitFor(() => {
        expect(screen.getByText(/user@example.com/i)).toBeInTheDocument();
        });
    
        // Clica no botão "Configurações"
        fireEvent.click(screen.getByRole('button', { name: /Configurações/i }));
    
        // Verifica se o alerta foi exibido
        expect(mockAlert).toHaveBeenCalledWith(
        'Acesso negado! Apenas administradores podem acessar a página de configurações.'
        );
    
        // Verifica que não houve navegação
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});