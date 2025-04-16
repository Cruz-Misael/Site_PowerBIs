import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserSettings from '../../components/UserSettings';
import '@testing-library/jest-dom';

// Mocks globais
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('UserSettings - Unit Tests', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReset();
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
  });

  // Teste 1: Redireciona para /login se não estiver autenticado
  it('deve navegar para /login se não houver dados no localStorage', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null); // userEmail
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(<UserSettings />);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // Teste 2: Redireciona para /dashboard se não for admin
  it('deve navegar para /dashboard se não for admin', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('user@test.com') // userEmail
      .mockReturnValueOnce('User') // accessLevel (não admin)
      .mockReturnValueOnce('Dev Team'); // team

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(<UserSettings />);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  // Teste 3: Atualiza estado do formulário ao digitar
  it('deve atualizar o estado do formulário', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('admin@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    render(<UserSettings />);
    
    fireEvent.change(screen.getByLabelText('Nome:'), { target: { value: 'Novo Usuário' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'novo@test.com' } });
    fireEvent.click(screen.getByLabelText('Admin'));

    expect(screen.getByLabelText('Nome:')).toHaveValue('Novo Usuário');
    expect(screen.getByLabelText('Email:')).toHaveValue('novo@test.com');
    expect(screen.getByLabelText('Admin')).toBeChecked();
  });

  // Teste 4: Abre modal de edição ao clicar em ✏️
  it('deve abrir modal ao clicar em editar', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('admin@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    // Mock do estado users
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [
      [{ id: 1, name: 'Usuário Teste', email: 'teste@test.com', accessLevel: 'User', team: 'Dev Team' }],
      jest.fn(),
    ]);

    render(<UserSettings />);
    fireEvent.click(screen.getByText('✏️'));
    expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
  });

  // Teste 5: Validação de campos obrigatórios
  it('deve mostrar alerta se campos obrigatórios estiverem vazios', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('admin@test.com')
      .mockReturnValueOnce('Admin')
      .mockReturnValueOnce('Dev Team');

    render(<UserSettings />);
    fireEvent.click(screen.getByText('Salvar'));
    expect(window.alert).toHaveBeenCalledWith('Preencha todos os campos antes de salvar.');
  });
});