import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Teams from '../../components/Teams';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock das dependências
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock global do fetch
global.fetch = jest.fn();

describe('Teams - Testes de Integração', () => {
  const mockNavigate = jest.fn();
  const mockTeams = [
    { id: 1, name: 'Time A', description: 'Descrição A', isActive: true },
    { id: 2, name: 'Time B', description: 'Descrição B', isActive: false }
  ];

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    fetch.mockClear();
  });

  // Teste 1: Carregamento inicial e exibição de times
  it('deve carregar e exibir a lista de times corretamente', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTeams }),
      headers: { get: () => 'application/json' }
    });

    render(<Teams />);

    // Verifica se o loading aparece inicialmente
    expect(screen.getByText('Carregando times...')).toBeInTheDocument();

    // Aguarda o carregamento
    await waitFor(() => {
      expect(screen.getByText('Times Cadastrados')).toBeInTheDocument();
      expect(screen.getByText('Time A')).toBeInTheDocument();
      expect(screen.getByText('Time B')).toBeInTheDocument();
      expect(screen.getByText('Ativo')).toBeInTheDocument();
      expect(screen.getByText('Inativo')).toBeInTheDocument();
    });
  });

  // Teste 2: Criação de um novo time
  it('deve permitir criar um novo time', async () => {
    fetch.mockImplementation((url) => {
      if (url.endsWith('/teams')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
          headers: { get: () => 'application/json' }
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: [] }),
        headers: { get: () => 'application/json' }
      });
    });

    render(<Teams />);

    // Preenche o formulário
    fireEvent.change(screen.getByLabelText('Time:'), { target: { value: 'Novo Time' } });
    fireEvent.change(screen.getByLabelText('Descrição:'), { target: { value: 'Nova Descrição' } });

    // Submete o formulário

    const saveButton = await screen.findByRole('button', { name: 'Salvar' });
    fireEvent.click(saveButton);

    // Verifica se a mensagem de sucesso aparece
    await waitFor(() => {
      expect(screen.getByText('Time criado com sucesso!')).toBeInTheDocument();
    });
  });

  // Teste 3: Edição de um time existente
  it('deve permitir editar um time existente', async () => {
    fetch.mockImplementation((url) => {
      if (url.endsWith('/teams')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockTeams }),
          headers: { get: () => 'application/json' }
        });
      }
      if (url.endsWith('/teams/1')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
          headers: { get: () => 'application/json' }
        });
      }
    });

    render(<Teams />);

    // Aguarda o carregamento dos times
    await waitFor(() => {
      expect(screen.getByText('Time A')).toBeInTheDocument();
    });

    // Clica no botão de editar do primeiro time
    const editButtons = screen.getAllByRole('button', { name: /✏️/ });
    fireEvent.click(editButtons[0]);

    // Verifica se o formulário foi preenchido com os dados do time
    expect(screen.getByDisplayValue('Time A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descrição A')).toBeInTheDocument();

    // Altera os valores
    fireEvent.change(screen.getByLabelText('Time:'), { target: { value: 'Time A Editado' } });

    // Submete o formulário
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }));

    // Verifica se a mensagem de sucesso aparece
    await waitFor(() => {
      expect(screen.getByText('Time atualizado com sucesso!')).toBeInTheDocument();
    });
  });
});