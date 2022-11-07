import { clearDB } from '../support/database';

describe('/rosters', () => {
  it('should display the correct metadata', () => {
    cy.visit('/rosters');
    cy.title().should('equal', 'Moonbreaker Rosters List | Roster Breaker');
    cy.get('head meta[name=description]')
      .should('have.attr', 'content')
      .should(
        'equal',
        'Find the newest, most popular and most competitive community-made rosters.'
      );
  });

  it('should display a message when no rosters are added', () => {
    clearDB();
    cy.visit('/rosters');
    cy.get('p').contains(
      'No rosters published for the current Moonbreaker patch.'
    );
  });
});
