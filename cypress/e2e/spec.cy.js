// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })

describe('Fluxos E2E da Aplicação', () => {
  // Teste 1: Login bem-sucedido
  it('Deve fazer login e redirecionar para o dashboard', () => {
    cy.visit('/login');
    cy.get('#email').type('usuario@teste.com');
    cy.get('#password').type('SenhaUser123!');
    cy.get('.login-button').click();
    cy.url().should('include', '/user-dashboard');
  });

  // Teste 2: Login inválido
  it('Deve mostrar erro com credenciais inválidas', () => {
    cy.visit('/login');
    cy.get('#email').type('usuario@teste.com');
    cy.get('#password').type('Senhaerrada123!');
    cy.get('.login-button').click();
    cy.contains('Senha incorreta').should('exist');
  });

  // Teste 3: Navegação para configurações (como admin)
  it('Admin deve acessar configurações', () => {
    // Mock de login como admin
    cy.loginAsAdmin();
    cy.visit('/user-dashboard');
    cy.get('.config-btn').click();
    cy.url().should('include', '/user-settings');
  });

  // Teste 4: Criar novo dashboard (como admin)
  it('Deve criar um novo dashboard', () => {
    cy.loginAsAdmin();
    cy.visit('/dashboard-admin');
    cy.get('input[placeholder="Título"]').type('Novo Dashboard');
    cy.get('input[placeholder="URL"]').type('https://exemplo.com');
    cy.contains('Criar Dashboard').click();
  });

  // Teste 5: Acesso negado para não-admin
  it('Usuário comum não deve acessar configurações', () => {
    cy.loginAsUser();
    cy.visit('/user-dashboard');
    cy.get('.config-btn').click();
    cy.url().should('include', '/user-dashboard');
  });

  // Teste 6: Logout
  it('Deve fazer logout corretamente', () => {
    cy.loginAsUser();
    cy.visit('/user-dashboard');
    cy.get('.logout-btn').click();
    cy.url().should('include', '/login');
  });
});