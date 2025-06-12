/// <reference types="cypress" />

import { Utilities } from '../../../support/utilities';

describe('Student page', () => {
    const CypressEnv = Cypress.env();
    beforeEach(() => {
        cy.login();
    });

    it('Should add a new student', () => {
        cy.visit(`${CypressEnv.host}#/students/add`);
    
        cy.dynamicControl('input', 'FirstName').type('XkMsuxKi');
        cy.dynamicControl('input', 'MiddleName').type('ZzPhpjjp');
        cy.dynamicControl('input', 'LastName').type('OxTmIbSF');
        cy.dynamicControl('input', 'StudentCode').type('KoWGPtZI');
        cy.dynamicControl('input', 'MedicaidNo').type('nhpqCrBH');
        cy.dynamicControl('input', 'Grade').type('RbTEvNGl');
        cy.selectDate('DateOfBirth');
        cy.selectButtonGroupValue('AddressId', '1');
        cy.selectButtonGroupValue('SchoolId', '1');
        cy.selectButtonGroupValue('CreatedById', '1');
        cy.selectButtonGroupValue('ModifiedById', '1');
        cy.selectDate('DateCreated');
        cy.selectDate('DateModified');
        cy.get('.btn')
            .contains('Save')
            .click();
        cy.url().should('match', Utilities.idUrlRegEx);
        cy.get('.toast-message').contains('Student saved successfully.');
    });

    it('Should add a new student and fail', () => {
        cy.visit(`${CypressEnv.host}#/students/add`);
        cy.get('.btn')
            .contains('Save')
            .click();
        cy.get('.toast-error').contains('Save failed');
    });
});
