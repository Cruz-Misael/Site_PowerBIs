import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserSettings from '../../components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import React from 'react';

// Mock do react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock do axios
jest.mock('axios');

// Mock do fetch
global.fetch = jest.fn();

describe('UserSettings - Testes Unitários', () => {
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
  
    // Mock localStorage
    localStorage.setItem('userEmail', 'admin@example.com');
    localStorage.setItem('accessLevel', 'Admin');
    localStorage.setItem('team', 'Comercial');
  
    // Mock API responses
    axios.get.mockResolvedValue({ data: mockUsers });
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockTeams }),
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário e a tabela de usuários corretamente', async () => {
    render(<UserSettings />);
  
    // Verifica os campos do formulário
    expect(screen.getByLabelText('Nome:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('User')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
  
    // Aguarda os dados dos usuários serem carregados e renderizados
    await waitFor(() => {
      expect(screen.getByText('Usuário 1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('Usuário 2')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    });
  });
  

  it('deve atualizar o campo Nome ao digitar', () => {
    render(<UserSettings />);

    const nameInput = screen.getByLabelText('Nome:');
    fireEvent.change(nameInput, { target: { value: 'Novo Usuário' } });

    expect(nameInput).toHaveValue('Novo Usuário');
  });

  it('deve abrir o modal de edição com os dados do usuário ao clicar no botão Editar', async () => {
    render(<UserSettings />);
  
    // Aguarda os usuários serem renderizados na tabela
    await waitFor(() => {
      expect(screen.getByText('Usuário 1')).toBeInTheDocument();
    });
  
    // Clica no primeiro botão de edição
    const editButton = screen.getAllByTestId('edit-button')[0];
    fireEvent.click(editButton);
  
    // Verifica que o modal está visível
    expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
  
    // Verifica que os dados do usuário estão no modal
    expect(screen.getByTestId('edit-name-input')).toHaveValue('Usuário 1');
    expect(screen.getByTestId('edit-email-input')).toHaveValue('user1@example.com');
  });
});