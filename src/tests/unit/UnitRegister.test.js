import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../components/Register';
import React from 'react';


describe ('Register Screen', () => {
  test('Should render register component', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Digite seu email');
    const passwordInput = screen.getByPlaceholderText('Digite a nova senha');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme a senha');

    fireEvent.change( emailInput, { target: { value:'teste@email.com.br'}})
    fireEvent.change( passwordInput, { target: { value:'Senha@123'}})
    fireEvent.change( confirmPasswordInput, { target: { value:'Senha@123'}})

    expect( emailInput).toHaveValue('teste@email.com.br');
    expect( passwordInput).toHaveValue('Senha@123');
    expect( confirmPasswordInput).toHaveValue('Senha@123');

  });
});

