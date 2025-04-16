import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Teams from '../../components/Teams';
import '@testing-library/jest-dom';

// Mock do fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
    headers: { get: () => 'application/json' },
  })
);

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Teams Component - Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  // Teste 1: Carregamento inicial de times
  it('deve carregar times da API ao montar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        success: true, 
        data: [{ id: 1, name: 'Dev Team', isActive: true }] 
      }),
    });

    render(
      <MemoryRouter>
        <Teams />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dev Team')).toBeInTheDocument();
    });
  });

  // Teste 2: Criar um novo time
  it('deve enviar um novo time para a API', async () => {
    render(
      <MemoryRouter>
        <Teams />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Time:'), { target: { value: 'Financeiro' } });
    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Financeiro', description: '' }),
        })
      );
    });
  });

  // Teste 3: Deletar um time
  it('deve chamar a API ao deletar um time', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        success: true, 
        data: [{ id: 1, name: 'Dev Team', isActive: true }] 
      }),
    });

    render(
      <MemoryRouter>
        <Teams />
      </MemoryRouter>
    );

    window.confirm = jest.fn(() => true); // Mock do confirm

    await waitFor(() => {
      fireEvent.click(screen.getByText('❌'));
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/teams/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});