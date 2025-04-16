import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardAdmin from '../../components/DashboardAdmin';

// Mock completo das APIs
beforeEach(() => {
  global.fetch = jest.fn()
    // Mock para fetchDashboards
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, title: 'Dashboard 1' }
      ])
    })
    // Mock para fetchTeams
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: [{ name: 'Comercial' }]
      })
    })
    // Mock para fetchDashboardAccess
    .mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [{ team: 'Comercial' }]
      })
    });
});

test('Renderiza corretamente', async () => {
  render(
    <MemoryRouter>
      <DashboardAdmin />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Dashboard 1')).toBeInTheDocument();
  });
});