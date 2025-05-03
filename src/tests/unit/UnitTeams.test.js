import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Teams from '../../components/Teams';
import '@testing-library/jest-dom';

// Mock básico do fetch
beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Unit Teams', () => {
  test('mostra o título "Times Cadastrados"', () => {
    render(
      <MemoryRouter>
        <Teams />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Times Cadastrados')).toBeInTheDocument();
  });

  test('mostra o cabeçalho "Criar Novo Time"', () => {
    render(
      <MemoryRouter>
        <Teams />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: 'Criar Novo Time' })).toBeInTheDocument();
  });

  test('tem um campo para digitar o nome do time', () => {
    render(
      <MemoryRouter>
        <Teams />
      </MemoryRouter>
    );
    
    expect(screen.getByLabelText('Time:')).toBeInTheDocument();
  });

  test('tem um botão de submit no formulário', () => {
    render(
      <MemoryRouter>
        <Teams />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('button', { name: /salvar|processando/i })).toBeInTheDocument();
  });
});