import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardAdmin from '../../components/DashboardAdmin'; // Caminho corrigido
import '@testing-library/jest-dom';


// Mock das chamadas API
beforeEach(() => {
  global.fetch = jest.fn()
    .mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { 
            id: 1, 
            title: 'Dashboard Teste', 
            description: 'Descrição teste',
            url: 'http://test.com',
            access: ['Time A']
          }
        ])
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: [{ name: 'Time A' }, { name: 'Time B' }]
        })
      })
    );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('DashboardAdmin - Testes de Integração', () => {
  test('carrega e exibe dashboards e times corretamente', async () => {
    render(
      <MemoryRouter>
        <DashboardAdmin />
      </MemoryRouter>
    );

    // Verifica se os dados carregaram
    await waitFor(() => {
      expect(screen.getByText('Dashboard Teste')).toBeInTheDocument();
      expect(screen.getByText('Time A')).toBeInTheDocument();
    });
  });

  test('permite criar um novo dashboard', async () => {
    render(
      <MemoryRouter>
        <DashboardAdmin />
      </MemoryRouter>
    );

    // Mock da resposta POST
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true
      })
    );

    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('Título'), { 
      target: { value: 'Novo Dashboard' } 
    });
    fireEvent.change(screen.getByPlaceholderText('URL'), { 
      target: { value: 'http://novo.com' } 
    });

    // Submete o formulário
    fireEvent.click(screen.getByText('Criar Dashboard'));

    // Verifica se a chamada foi feita
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/dashboard'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('permite adicionar acesso a um time', async () => {
    render(
      <MemoryRouter>
        <DashboardAdmin />
      </MemoryRouter>
    );

    // Aguarda carregar os dados
    await screen.findByText('Dashboard Teste');

    // Mock da resposta POST para acesso
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true
      })
    );

    // Seleciona um time e adiciona acesso
    fireEvent.change(screen.getAllByRole('combobox')[0], { 
      target: { value: 'Time B' } 
    });
    fireEvent.click(screen.getAllByText('Adicionar Acesso')[0]);

    // Verifica se a chamada foi feita
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/dashboard/access'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });
});