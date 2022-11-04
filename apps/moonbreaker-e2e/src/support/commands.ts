import { encode } from './auth';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      loginByGoogleApi(): void;
      login(): void;
    }
  }
}

Cypress.Commands.add('loginByGoogleApi', () => {
  cy.log('Logging in to Google');
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { access_token, id_token } = body;
    cy.request({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(async ({ body }) => {
      cy.log(body);

      const sessionData = {
        user: { ...body },
        expires: '3000-01-01T00:00:00.000Z',
        accessToken: access_token,
      };

      cy.intercept('/api/auth/session', sessionData).as('session');

      const encodedData = await encode(
        sessionData,
        Cypress.env('nextAuthJWTSecret')
      );
      cy.setCookie('next-auth.session-token', encodedData);
      Cypress.Cookies.preserveOnce('next-auth.session-token');

      cy.visit('/');
    });
  });
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
