/// <reference types="cypress" />

import { Utilities } from '../../../support/utilities';

describe('Goal page', () => {
    const CypressEnv = Cypress.env();
    beforeEach(() => {
        cy.login();
    });

    it('Should add a new goal', () => {
        cy.visit(`${CypressEnv.host}#/goals/add`);
    
        cy.dynamicControl('input', 'Description').type('AIsBpyLA');
        cy.dynamicControl('input', 'SpecialNurseInformation').type('qDyIafOn');
        cy.get('.btn')
            .contains('Save')
            .click();
        cy.url().should('match', Utilities.idUrlRegEx);
        cy.get('.toast-message').contains('Goal saved successfully.');
    });

    it('Should add a new goal and fail', () => {
        cy.visit(`${CypressEnv.host}#/goals/add`);
        cy.get('.btn')
            .contains('Save')
            .click();
        cy.get('.toast-error').contains('Save failed');
    });
});
