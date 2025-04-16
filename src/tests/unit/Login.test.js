import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../components/Login';
import React from 'react';


const sum = (a, b) => a + b;
sum (1,2);
describe('App Component', () => {
    test('Should sum correctly', () => {
        expect(sum(1, 2)).toBe(3);
      }
    );
})



describe('Componente Login', () => {
  test('Should render login component', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
  const emailInput = screen.getByPlaceholderText('Digite seu email');
  const passwordInput = screen.getByPlaceholderText('Digite sua senha');

  fireEvent.change(emailInput, { target: {value: 'teste@exemplo.com'}});
  fireEvent.change(passwordInput, { target: { value: 'Senha@123'}});

  expect(emailInput).toHaveValue('teste@exemplo.com');
  expect(passwordInput).toHaveValue('Senha@123');

  });
});

