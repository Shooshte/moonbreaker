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

    // TODO: figure out how to test this authenticated route redirects

    // PRIVATE_ROUTES.forEach((route) => {
    //   it(`${route} should not redirect when authenticated`, () => {
    //     cy.visit('/');
    //     cy.loginByGoogleApi();
    //     cy.visit(route);
    //     cy.url().should('not.include', route);
    //     cy.url().should('include', '/login');
    //   });
    // });

    // TODO: figure out how to test SSO login
  });
});