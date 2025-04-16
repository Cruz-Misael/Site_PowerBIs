import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Teams from '../../components/Teams';
import '@testing-library/jest-dom';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Teams Component - Unit Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // Teste 1: Renderização inicial
  it('deve renderizar o formulário e a tabela vazia', () => {
    render(<Teams />);
    expect(screen.getByText('Criar Novo Time')).toBeInTheDocument();
    expect(screen.getByText('Times Cadastrados')).toBeInTheDocument();
    expect(screen.getByText('Nenhum time cadastrado.')).toBeInTheDocument();
  });

  // Teste 2: Atualização do estado do formulário
  it('deve atualizar os campos do formulário', () => {
    render(<Teams />);
    
    fireEvent.change(screen.getByLabelText('Time:'), { target: { value: 'Marketing' } });
    fireEvent.change(screen.getByLabelText('Descrição:'), { target: { value: 'Time de mídias' } });

    expect(screen.getByLabelText('Time:')).toHaveValue('Marketing');
    expect(screen.getByLabelText('Descrição:')).toHaveValue('Time de mídias');
  });

  // Teste 3: Validação de campo obrigatório
  it('deve exibir erro se o nome estiver vazio', () => {
    render(<Teams />);
    fireEvent.click(screen.getByText('Salvar'));
    expect(screen.getByText('Nome do time é obrigatório')).toBeInTheDocument();
  });

  // Teste 4: Botão "Voltar"
  it('deve chamar navigate ao clicar em "Voltar"', () => {
    render(<Teams />);
    fireEvent.click(screen.getByText('Voltar'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});