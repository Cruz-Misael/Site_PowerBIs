import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserDashboard from '../../components/UserDashboard';
import '@testing-library/jest-dom';

// Mock das funções globais
beforeEach(() => {
  // Mock do localStorage
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "userEmail") return "usuario@teste.com";
    if (key === "accessLevel") return "User";
    if (key === "team") return "Time Teste";
    return null;
  });

  // Mock do fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('UserDashboard', () => {
  test('renderiza o cabeçalho com informações do usuário', () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/DASHBOARDS:/i)).toBeInTheDocument();
    expect(screen.getByText(/Time Teste/i)).toBeInTheDocument();
    expect(screen.getByText(/Sair/i)).toBeInTheDocument();
  });

  test('mostra mensagem quando não há dashboards', async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Nenhum dashboard disponível para seu time/i)).toBeInTheDocument();
  });

  test('exibe os botões de navegação corretamente', () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Configurações/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dashboard Admin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Times/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sair/i })).toBeInTheDocument();
  });
});