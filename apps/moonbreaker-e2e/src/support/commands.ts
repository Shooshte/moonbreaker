import { encode } from './auth';
import type { JWTPayload } from 'jose';

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
      login(userObj: JWTPayload): void;
    }
  }
}

Cypress.Commands.add('login', (userObj: JWTPayload) => {
  const sessionResponse = {
    user: userObj,
    expires: '3000-12-12T12:09:28.543Z',
  };

  // TODO: add storing session cookie here

  cy.intercept('/api/auth/session', sessionResponse).as('session');
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
