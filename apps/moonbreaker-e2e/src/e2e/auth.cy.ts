import { clearDB } from '../support/database';

// TODO: move this to docker database setup
before(async () => {
  await clearDB();
});

describe('authentication flow', () => {
  describe('public routes', () => {
    const PUBLIC_ROUTES = ['/roster/testID', 'rosters', '/login'];

    PUBLIC_ROUTES.forEach((route) => {
      it(` ${route} should not redirect`, () => {
        cy.visit(route);
        cy.url().should('include', route);
      });
    });
  });

  describe('private routes', () => {
    const PRIVATE_ROUTES = ['/add-roster'];

    PRIVATE_ROUTES.forEach((route) => {
      it(`${route} should redirect to /login when not authenticated`, () => {
        cy.visit(route);
        cy.url().should('not.include', route);
        cy.url().should('include', '/login');
      });
    });

    PRIVATE_ROUTES.forEach((route) => {
      it(`${route} should not redirect when authenticated`, () => {
        cy.visit('/');
        cy.login({
          id: 'cb9a576e-ad96-49c6-a8ce-8fa39a4fcf83',
          name: 'Miha Šušteršič',
          email: 'miha.sustersic.work@gmail.com',
          image:
            'https://lh3.googleusercontent.com/a/ALm5wu36PI4sffp_QYZ-_q5oD6PeFjoxAk0H8hphGWU1Lw=s96-c',
        });
        cy.visit(route);
        cy.wait('@session');
        cy.url().should('not.include', '/login');
        cy.url().should('include', route);
      });
    });
  });
});
