import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Teams from '../../components/Teams';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';


// Mock das dependências
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Teams - Testes de Integração', () => {
  const mockTeams = [
    { id: 1, name: 'Time A', description: 'Descrição A', isActive: true },
    { id: 2, name: 'Time B', description: 'Descrição B', isActive: false }
  ];

  beforeEach(() => {
    // Mock do navigate
    useNavigate.mockReturnValue(jest.fn());
    
    // Mock do fetch
    global.fetch = jest.fn((url) => {
      if (url === process.env.REACT_APP_API_URL) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: mockTeams
          }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
          text: () => Promise.resolve(JSON.stringify({
            success: true,
            data: mockTeams
          }))
        });
      }
      return Promise.reject(new Error('Endpoint não mockado'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve permitir editar um time existente', async () => {
    // Renderiza o componente dentro de act
    await act(async () => {
      render(<Teams />);
    });

    // Debug: mostra o HTML atual (útil para diagnóstico)
    screen.debug();

    // Aguarda o carregamento dos times
    await waitFor(() => {
      // Verifica se a mensagem de erro não está mais visível
      expect(screen.queryByText('Failed to load teams')).not.toBeInTheDocument();
      // Verifica se os times foram carregados
      expect(screen.getByText('Time A')).toBeInTheDocument();
      expect(screen.getByText('Time B')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Encontra e clica no botão de edição (usando o emoji de lápis)
    const editButtons = screen.getAllByRole('button', { name: /✏️/i });
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });

    // Verifica se o formulário foi preenchido com os dados do time
    expect(screen.getByDisplayValue('Time A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descrição A')).toBeInTheDocument();

    // Altera os valores
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Time:'), { 
        target: { value: 'Time A Editado' } 
      });
      fireEvent.change(screen.getByLabelText('Descrição:'), { 
        target: { value: 'Descrição Editada' } 
      });
    });

    // Mock da resposta de atualização
    global.fetch.mockImplementationOnce((url, options) => {
      if (url.includes('/teams/') && options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              ...mockTeams[0],
              name: 'Time A Editado',
              description: 'Descrição Editada'
            }
          })
        });
      }
      return Promise.reject(new Error('Endpoint não mockado'));
    });

    // Submete o formulário
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Atualizar|Salvar/i }));
    });

    // Verifica se a atualização foi bem-sucedida
    await waitFor(() => {
      expect(screen.getByText('Time atualizado com sucesso!')).toBeInTheDocument();
    });
  });
});