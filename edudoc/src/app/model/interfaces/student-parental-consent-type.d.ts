import { IEntity } from './base';

import { IStudentParentalConsent } from './student-parental-consent';

export interface IStudentParentalConsentType extends IEntity {
    Name: string;

    // reverse nav
    StudentParentalConsents?: IStudentParentalConsent[];
}
