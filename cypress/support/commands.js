Cypress.Commands.add('loginAsAdmin', () => {
    cy.session('admin', () => {
      cy.visit('/login');
      cy.get('#email').type('admin@teste.com');
      cy.get('#password').type('SenhaAdmin123!');
      cy.get('.login-button').click();
      cy.url().should('include', '/user-dashboard');
    });
  });
  
  Cypress.Commands.add('loginAsUser', () => {
    cy.session('user', () => {
      cy.visit('/login');
      cy.get('#email').type('usuario@teste.com');
      cy.get('#password').type('SenhaUser123!');
      cy.get('.login-button').click();
      cy.url().should('include', '/user-dashboard');
    });
  });