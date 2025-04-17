import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserDashboard from '../../components/UserDashboard';
import '@testing-library/jest-dom';

jest.mock('../../assets/sebraFundoBranco.jpg', () => 'mocked-logo.jpg');

describe('UserDashboard Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders the UserDashboard component', () => {
    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('accessLevel', 'User');
    localStorage.setItem('team', 'Team A');

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/DASHBOARDS:/)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  test('redirects to login if user data is missing', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('calls logout and clears localStorage', () => {
    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('accessLevel', 'User');
    localStorage.setItem('team', 'Team A');

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('userEmail')).toBeNull();
    expect(localStorage.getItem('accessLevel')).toBeNull();
    expect(localStorage.getItem('team')).toBeNull();
  });

  test('shows "Acesso negado!" alert when non-admin tries to access admin pages', () => {
    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('accessLevel', 'User');
    localStorage.setItem('team', 'Team A');

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    const configButton = screen.getByText('Configurações');
    window.alert = jest.fn();
    fireEvent.click(configButton);

    expect(window.alert).toHaveBeenCalledWith(
      'Acesso negado! Apenas administradores podem acessar a página de configurações.'
    );
  });

  test('renders dashboards when data is available', async () => {
    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('accessLevel', 'User');
    localStorage.setItem('team', 'Team A');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, title: 'Dashboard 1', description: 'Description 1', url: 'http://example.com/1' },
          ]),
      })
    );

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    const dashboardTitle = await screen.findByText('Dashboard 1');
    expect(dashboardTitle).toBeInTheDocument();
  });

  test('displays message when no dashboards are available', async () => {
    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('accessLevel', 'User');
    localStorage.setItem('team', 'Team A');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    const noDashboardsMessage = await screen.findByText('Nenhum dashboard disponível para seu time.');
    expect(noDashboardsMessage).toBeInTheDocument();
  });
});
