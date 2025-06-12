import { IEntity } from './base';

import { IStudent } from './student';
import { IStudentParentalConsentType } from './student-parental-consent-type';
import { IUser } from './user';

export interface IStudentParentalConsent extends IEntity {
    StudentId: number;
    ParentalConsentEffectiveDate?: Date;
    ParentalConsentDateEntered: Date;
    ParentalConsentTypeId: number;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    Student?: IStudent;
    StudentParentalConsentType?: IStudentParentalConsentType;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
