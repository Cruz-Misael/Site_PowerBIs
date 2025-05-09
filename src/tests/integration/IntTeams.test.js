import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Teams from '../../components/Teams';
import '@testing-library/jest-dom';

// Mock do useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

describe('Teams - Teste básico de edição', () => {
  beforeEach(() => {
    // Mock do fetch para carregar os times
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { id: 1, name: 'Time A', description: 'Descrição A', isActive: true }
        ]
      }),
      headers: {
        get: () => 'application/json'
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('deve carregar time e preencher o formulário ao editar', async () => {
    render(<Teams />);

    // Espera o nome do time aparecer na tela
    const nomeTime = await screen.findByText('Time A');
    expect(nomeTime).toBeInTheDocument();

    // Clica no botão de editar (usando o emoji ✏️)
    const editButton = screen.getByRole('button', { name: /✏️/i });
    fireEvent.click(editButton);

    // Espera os campos serem preenchidos com os dados do time
    expect(await screen.findByDisplayValue('Time A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descrição A')).toBeInTheDocument();
  });
});
