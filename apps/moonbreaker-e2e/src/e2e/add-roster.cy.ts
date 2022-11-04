import { addUnits, clearDB } from '../support/database';

// TODO: move this to docker database setup
before(async () => {
  await clearDB();
  await addUnits({ patchName: 'Pre-Alpha 39919' });
});

describe('page titles', () => {
  // beforeEach(() => {
  //   cy.loginByGoogleApi();
  // });
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
