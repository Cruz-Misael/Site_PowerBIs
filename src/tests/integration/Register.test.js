import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChangePassword from '../../components/Register';
import { useNavigate } from 'react-router-dom';

// Mock das dependências
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock global do fetch
global.fetch = jest.fn();

describe('ChangePassword', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    fetch.mockClear();
  });

  // Teste 1: Verifica renderização básica
  it('deve renderizar o formulário de alteração de senha corretamente', () => {
    render(<ChangePassword />);
    
    expect(screen.getByRole('heading', { name: 'Alterar Senha' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a nova senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirme a senha')).toBeInTheDocument();
    expect(screen.getByText('Voltar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alterar Senha' })).toBeInTheDocument();
  });

  // Teste 2: Verifica validação de senha
  it('deve mostrar erro quando a senha não atende aos requisitos', () => {
    render(<ChangePassword />);
    
    const passwordInput = screen.getByPlaceholderText('Digite a nova senha');
    const changeButton = screen.getByRole('button', { name: 'Alterar Senha' });
    
    // Senha fraca (não atende aos requisitos)
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(changeButton);
    
    expect(screen.getByText(/A senha deve ter pelo menos 8 caracteres/i)).toBeInTheDocument();
  });

  // Teste 3: Verifica comportamento quando as senhas não coincidem
  it('deve mostrar erro quando as senhas não coincidem', () => {
    render(<ChangePassword />);
    
    const passwordInput = screen.getByPlaceholderText('Digite a nova senha');
    const confirmInput = screen.getByPlaceholderText('Confirme a senha');
    const changeButton = screen.getByRole('button', { name: 'Alterar Senha' });
    
    // Senhas diferentes
    fireEvent.change(passwordInput, { target: { value: 'Senha123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Senha123#' } });
    fireEvent.click(changeButton);
    
    expect(screen.getByText('As senhas não coincidem!')).toBeInTheDocument();
  });

  // Teste extra: Verifica navegação ao clicar em Voltar
  it('deve navegar para /login ao clicar no botão Voltar', () => {
    render(<ChangePassword />);
    
    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});