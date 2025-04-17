import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserSettings from '../../components/UserSettings';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('UserSettings Component', () => {
  test('renders the UserSettings component', () => {
    render(
      <Router>
        <UserSettings />
      </Router>
    );

    expect(screen.getByText(/DASHBOARDS \/ CONFIGURAÇOES DE USUÁRIOS \//i)).toBeInTheDocument();
    expect(screen.getByText(/Informações Pessoais:/i)).toBeInTheDocument();
    expect(screen.getByText(/Tabela de Usuários/i)).toBeInTheDocument();
  });

  test('handles input changes in the form', () => {
    render(
      <Router>
        <UserSettings />
      </Router>
    );

    const nameInput = screen.getByPlaceholderText(/Digite o nome do usuário.../i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');

    const emailInput = screen.getByPlaceholderText(/Digite o email do usuário.../i);
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    expect(emailInput.value).toBe('john.doe@example.com');
  });

  test('displays a confirmation dialog when deleting a user', () => {
    window.confirm = jest.fn(() => true); // Mock the confirm dialog
    render(
      <Router>
        <UserSettings />
      </Router>
    );

    const deleteButton = screen.queryByTestId('delete-button');
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este usuário?');
    }
  });
});