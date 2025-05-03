import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import UserSettings from '../../components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';


// Mock do react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock do axios
jest.mock('axios');

// Mock do fetch
global.fetch = jest.fn();

// Mock do window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock do window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

describe('UserSettings - Testes de Integração', () => {
  const mockNavigate = jest.fn();
  const mockUsers = [
    { id: 1, name: 'Usuário 1', email: 'user1@example.com', accessLevel: 'User', team: 'Comercial' },
    { id: 2, name: 'Usuário 2', email: 'user2@example.com', accessLevel: 'Admin', team: 'Suporte' },
  ];
  const mockTeams = [
    { name: 'Comercial' },
    { name: 'Suporte' },
  ];

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    axios.get.mockClear();
    axios.post.mockClear();
    axios.put.mockClear();
    axios.delete.mockClear();
    fetch.mockClear();
    mockAlert.mockClear();
    mockConfirm.mockClear();

    localStorage.setItem('userEmail', 'admin@example.com');
    localStorage.setItem('accessLevel', 'Admin');
    localStorage.setItem('team', 'Comercial');

    axios.get.mockResolvedValue({ data: mockUsers });
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockTeams }),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve renderizar a tela com a lista de usuários e times', async () => {
    render(<UserSettings />);

    await waitFor(() => {
      expect(screen.getByText('Usuário 1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('Usuário 2')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Comercial' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Suporte' })).toBeInTheDocument();
    });
  });

  it('deve criar um novo usuário ao preencher o formulário e clicar em Salvar', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });
  
    render(<UserSettings />);
  
    await waitFor(() => {
      expect(screen.getByText('Usuário 1')).toBeInTheDocument();
    });
  
    fireEvent.change(screen.getByLabelText('Nome:'), { target: { value: 'Novo Usuário' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'novo@example.com' } });
    fireEvent.click(screen.getByLabelText('User'));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Comercial' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          name: 'Novo Usuário',
          email: 'novo@example.com',
          accessLevel: 'User',
          team: 'Comercial',
        }
      );
    });
  
    // Wait for the form to reset
    await waitFor(() => {
      expect(screen.getByLabelText('Nome:')).toHaveValue('');
      expect(screen.getByLabelText('Email:')).toHaveValue('');
    });
  });

  it('deve abrir o modal de edição com os dados do usuário ao clicar no botão Editar', async () => {
    render(<UserSettings />);
  
    await waitFor(() => {
      expect(screen.getByText('Usuário 1')).toBeInTheDocument();
    });
  
    const editButton = screen.getAllByTestId('edit-button')[0];
    fireEvent.click(editButton);
  
    await waitFor(() => {
      expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
    });
  
    expect(screen.getByTestId('edit-name-input')).toHaveValue('Usuário 1');
    expect(screen.getByTestId('edit-email-input')).toHaveValue('user1@example.com');
    expect(screen.getByTestId('edit-access-user')).toBeChecked();
    expect(screen.getByTestId('edit-team-select')).toHaveValue('Comercial');
  });
});