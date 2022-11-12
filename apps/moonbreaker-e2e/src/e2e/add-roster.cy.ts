import { addUnits, clearDB } from '../support/database';
import userData from '../fixtures/user.json';

// TODO: move this to docker database setup
before(async () => {
  await clearDB();
  await addUnits({ patchName: 'Pre-Alpha 39919' });
});

describe('/add-roster', () => {
  beforeEach(() => {
    // Unauthenticated user flow is tested in auth.cy.ts so we mock a user session before every test
    cy.login(userData);
    cy.visit('/add-roster');
    cy.wait('@session');
  });

  describe('metadata', () => {
    it('should have the correct title and description', () => {
      cy.title().should('equal', 'Add Roster | Roster Breaker');
      cy.get('head meta[name=description]')
        .should('have.attr', 'content')
        .should(
          'equal',
          'Create a draft or publish a roster list on Roster Breaker.'
        );
    });
  });

  // it('should have the correct page titles', () => {
  //   cy.loginByGoogleApi();
  //   cy.visit('/add-roster');
  //   cy.get('h1').contains('Add new roster');
  //   cy.get('h2').contains('Add unit to roster');
  //   cy.get('h2').contains('Roster name');
  //   cy.get('button').contains('Publish');
  //   cy.get('button').contains('Save draft');
  // });
});
