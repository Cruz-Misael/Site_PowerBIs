import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import UserSettings from '../../components/UserSettings';
import '@testing-library/jest-dom';

// Mock do axios
jest.mock('axios');

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('UserSettings - Integration Tests', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReset();
    axios.get.mockReset();
    axios.post.mockReset();
    axios.put.mockReset();
    axios.delete.mockReset();
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
  });

  // Teste 1: Carrega usuários e times da API ao montar
  it('deve carregar usuários e times da API', async () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('admin@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    axios.get.mockImplementation((url) => {
      if (url.includes('/users')) {
        return Promise.resolve({ data: [{ id: 1, name: 'Usuário 1', email: 'user1@test.com', accessLevel: 'User', team: 'Dev Team' }] });
      } else if (url.includes('/teams')) {
        return Promise.resolve({ data: { success: true, data: [{ name: 'Dev Team' }, { name: 'Infra Team' }] } });
      }
      return Promise.reject(new Error('URL não mockada'));
    });

    render(
      <MemoryRouter>
        <UserSettings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/users'));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/teams'));
      expect(screen.getByText('Usuário 1')).toBeInTheDocument();
      expect(screen.getByText('Dev Team')).toBeInTheDocument();
    });
  });

  // Teste 2: Cria novo usuário
  it('deve criar novo usuário ao preencher formulário', async () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('admin@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <UserSettings />
      </MemoryRouter>
    );

    const nomeInput = await screen.findByLabelText('Nome:');
    fireEvent.change(nomeInput, { target: { value: 'Novo Usuário' } });

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'novo@test.com' } });
    fireEvent.click(screen.getByLabelText('Admin'));
    fireEvent.change(screen.getByLabelText('Setor:'), { target: { value: 'Dev Team' } });
    fireEvent.click(screen.getByText('/salvar/i'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        {
          name: 'Novo Usuário',
          email: 'novo@test.com',
          accessLevel: 'Admin',
          team: 'Dev Team'
        }
      );
    });
  });

  // Teste 3: Atualiza usuário existente
  it('deve atualizar usuário no modal de edição', async () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('admin@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: 'Usuário 1', email: 'user1@test.com', accessLevel: 'User', team: 'Dev Team' }]
    });
    axios.put.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <UserSettings />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('edit-button'));
    });

    fireEvent.change(screen.getByDisplayValue('Usuário 1'), { target: { value: 'Usuário Editado' } });
    fireEvent.click(screen.getByText('Atualizar'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({ name: 'Usuário Editado' })
      );
    });
  });

  // Teste 4: Exclui usuário
  it('deve excluir usuário ao confirmar', async () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('admin@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: 'Usuário 1', email: 'user1@test.com', accessLevel: 'User', team: 'Dev Team' }]
    });
    axios.delete.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <UserSettings />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('delete-button'));   
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/users/1'));
  });
});