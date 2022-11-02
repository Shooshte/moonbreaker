import { addUnits, clearDB } from '../support/database';

// TODO: move this to docker database setup
before(async () => {
  await clearDB();
  // await addUnits({ patchName: 'Pre-Alpha 39919' });
});

describe('authentication flow', () => {
  describe('public routes', () => {
    const PUBLIC_ROUTES = ['/', '/login'];

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
        cy.loginByGoogleApi();
        cy.visit(route);
        cy.url().should('not.include', route);
        cy.url().should('include', '/login');
      });
    });
  });
});
