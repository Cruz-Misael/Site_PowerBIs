
// DashboardAdmin.jsx
import React from 'react'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardAdmin.css';
import logo from '../assets/sebraFundoBranco.jpg';
const API_BASE_URL = process.env.REACT_APP_API_URL;

function DashboardAdmin() {
  const [dashboards, setDashboards] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newDashboard, setNewDashboard] = useState({
    title: '',
    description: '',
    url: '',
    thumbnail: ''
  });
  const [accessRules, setAccessRules] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboards();
    fetchTeams();
  }, []);

  const handleRemoveAccess = async (dashboardId, team) => {
    if (!window.confirm(`Remover acesso do time ${team}?`)) return;
  
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/access`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardID: dashboardId,
          team: team
        })
      });
      
      if (!response.ok) throw new Error('Falha ao remover acesso');
      
      // Atualiza a UI removendo o acesso
      setDashboards(prevDashboards => 
        prevDashboards.map(dashboard => 
          dashboard.id === dashboardId
            ? {
                ...dashboard,
                access: dashboard.access.filter(t => t !== team)
              }
            : dashboard
        )
      );
      
    } catch (error) {
      console.error('Erro ao remover acesso:', error);
      alert('Falha ao remover acesso');
    }
  };


  const [dashboardAccess, setDashboardAccess] = useState({}); // Novo estado para armazenar os acessos

  
  // Example for fetchDashboardAccess in DashboardAdmin.js
  const fetchDashboardAccess = async (dashboardId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/access?dashboardId=${dashboardId}`);
        if (!response || !response.ok) {
            throw new Error(`Erro ao buscar acessos: ${response?.status || "sem resposta"}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Resposta não é JSON: ${text.substring(0, 100)}...`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error(`Erro ao buscar acessos para dashboard ${dashboardId}:`, error);
        return [];
    }
  };

  const fetchDashboards = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      if (!response.ok) throw new Error('Erro ao buscar dashboards');
      const dashboards = await response.json();
      
      // Busca os acessos para cada dashboard
      const dashboardsWithAccess = await Promise.all(
        dashboards.map(async dashboard => {
          const accessList = await fetchDashboardAccess(dashboard.id);
          return {
            ...dashboard,
            access: accessList.map(item => item.team) // Armazena apenas os nomes dos times
          };
        })
      );

      setDashboards(dashboardsWithAccess);
      
      // Inicializa accessRules com os valores atuais
      const initialAccessRules = {};
      dashboardsWithAccess.forEach(dashboard => {
        if (dashboard.access && dashboard.access.length > 0) {
          initialAccessRules[dashboard.id] = dashboard.access[0]; // Ou mantenha vazio
        }
      });
      setAccessRules(initialAccessRules);
      
    } catch (error) {
      console.error('Falha ao carregar dashboards:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`);
      if (!response.ok) throw new Error('Erro ao buscar times');
      const data = await response.json();
      if (data.success) {
        setTeams(data.data.map(team => team.name));
      } else {
        throw new Error(data.message || 'Erro ao carregar times');
      }
    } catch (error) {
      console.error('Falha ao carregar times:', error);
    }
  };

  const handleCreateDashboard = async () => {
    await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDashboard)
    });
    
    fetchDashboards();
    setNewDashboard({ title: '', description: '', url: '', thumbnail: '' });
  };

  const handleSetAccess = async (dashboardId) => {
    if (!accessRules[dashboardId]) {
      alert('Selecione um time antes de definir o acesso');
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardID: dashboardId,
          team: accessRules[dashboardId],
          accessLevel: 'view'
        })
      });
      
      if (!response.ok) throw new Error('Falha ao atualizar regras');
      
      // Atualiza a UI com o novo acesso
      setDashboards(prevDashboards => 
        prevDashboards.map(dashboard => 
          dashboard.id === dashboardId
            ? {
                ...dashboard,
                access: [...(dashboard.access || []), accessRules[dashboardId]]
              }
            : dashboard
        )
      );
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Falha ao atualizar regras de acesso');
    }
  };

  return (
    <div className="dashboard-admin">
      <header className="app-header">
        <img src={logo} alt="Logo" className="app-logo" />
        <h1 className="app-title">DASHBOARDS / GERENCIAMENTO DAS DASHBOARDS /</h1>
        <div>        
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            Voltar
          </button>
        </div>
      </header>

      <div className="dashboard-admin-content">
        <div className="create-dashboard">
          <h2>Criar Novo Dashboard</h2>
          <input
            placeholder="Título"
            value={newDashboard.title}
            onChange={(e) => setNewDashboard({...newDashboard, title: e.target.value})}
          />
          <input
            placeholder="URL"
            value={newDashboard.url}
            onChange={(e) => setNewDashboard({...newDashboard, url: e.target.value})}
          />
          <textarea
            placeholder="Descrição"
            value={newDashboard.description}
            onChange={(e) => setNewDashboard({...newDashboard, description: e.target.value})}
          />
          <button onClick={handleCreateDashboard}>Criar Dashboard</button>
        </div>

        <div className="dashboard-list">
          <h2>Dashboards Existentes</h2>
          {dashboards.map(dashboard => (
            <div key={dashboard.id} className="dashboard-item">
              <h3>{dashboard.title}</h3>
              <p>{dashboard.description}</p>
              
              {/* Mostra os times com acesso */}
              {dashboard.access && dashboard.access.length > 0 && (
                <div className="current-access">
                  <strong>Acesso permitido para:</strong>
                  <ul>
                    {dashboard.access.map(team => (
                      <li key={`${dashboard.id}-${team}`}>
                        {team}
                        <button 
                          className="remove-access"
                          onClick={() => handleRemoveAccess(dashboard.id, team)}
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Controle para adicionar novo acesso */}
              <div className="access-control">
                <select
                  value={accessRules[dashboard.id] || ''}
                  onChange={(e) => setAccessRules({
                    ...accessRules,
                    [dashboard.id]: e.target.value
                  })}
                >
                  <option value="">Selecione um time</option>
                  {teams
                    .filter(team => !dashboard.access?.includes(team)) // Mostra apenas times sem acesso
                    .map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))
                  }
                </select>
                <button onClick={() => handleSetAccess(dashboard.id)}>
                  Adicionar Acesso
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
    </div>
  );
}

export default DashboardAdmin;