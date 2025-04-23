import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../components/Login';
import '@testing-library/jest-dom';

// Mock global do fetch
global.fetch = jest.fn();

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock do navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component - Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockNavigate.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Teste 1: Fluxo de login bem-sucedido
  it('deve fazer login e redirecionar para /dashboard quando credenciais forem válidas', async () => {
    // Mock da resposta da API
    fetch.mockImplementationOnce((url) => {
      if (url.includes('/login')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            user: {
              email: 'test@example.com',
              accessLevel: 'Admin',
              team: 'Dev Team'
            }
          }),
        });
      }
      return Promise.reject(new Error('URL não mockada'));
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('Digite seu email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: 'Senha123!' }
    });

    // Submete o formulário
    fireEvent.click(screen.getByText('Entrar'));

    // Verifica se a API foi chamada corretamente
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'Senha123!'
          })
        })
      );
    });

    // Verifica localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessLevel', 'Admin');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('team', 'Dev Team');

    // Verifica mensagem de sucesso
    expect(await screen.findByText('Login bem-sucedido! Redirecionando...')).toBeInTheDocument();

    // Avança os timers e verifica navegação
    jest.advanceTimersByTime(1000);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  

  it('deve mostrar erro quando senha não atender aos requisitos', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Digite seu email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: 'fraca' }
    });
    fireEvent.click(screen.getByText('Entrar'));

    expect(await screen.findByText(/A senha deve ter pelo menos 8 caracteres/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  // Teste 4: Erro na API de login
  it('deve mostrar mensagem de erro quando a API falhar', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Credenciais inválidas' }),
      })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Digite seu email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: 'Senha123!' }
    });
    fireEvent.click(screen.getByText('Entrar'));

    expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument();
  });

  // Teste 5: Verificação de email em tempo real
  it('deve verificar existência do email ao perder o foco', async () => {
    fetch.mockImplementationOnce((url) => {
      if (url.includes('/check-email')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ exists: false }),
        });
      }
      return Promise.reject(new Error('URL não mockada'));
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Digite seu email');
    fireEvent.change(emailInput, { target: { value: 'inexistente@test.com' } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText('Verificando...')).toBeInTheDocument();
    expect(await screen.findByText('Este email não está registrado.')).toBeInTheDocument();
  });

  // Teste 6: Navegação para página de registro
  it('deve navegar para /register ao clicar em Registrar-se', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Registrar-se'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});