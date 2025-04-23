import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardAdmin from '../../components/DashboardAdmin';
import React from 'react';

describe('DashboardAdmin', () => {

  test('Should render title', () => {
    render(
        <MemoryRouter>
        <DashboardAdmin />
        </MemoryRouter>
    );

    expect(screen.getByText('DASHBOARDS / GERENCIAMENTO DAS DASHBOARDS /')).toBeInTheDocument();
  });

    test('Should update the form fields', () => {
      render(
        <MemoryRouter>
          <DashboardAdmin />
        </MemoryRouter>);
      const titleInput = screen.getByPlaceholderText('Título');
      const descriptionInput = screen.getByPlaceholderText('Descrição');
      const urlInput = screen.getByPlaceholderText('URL');

      fireEvent.change(titleInput, { target: { value: 'Novo Título' } });
      fireEvent.change(descriptionInput, { target: { value: 'Nova Descrição' } });
      fireEvent.change(urlInput, { target: { value: 'http://nova-url.com' } });

      expect(titleInput.value).toBe('Novo Título');
      expect(descriptionInput.value).toBe('Nova Descrição');
      expect(urlInput.value).toBe('http://nova-url.com');
    });
});

