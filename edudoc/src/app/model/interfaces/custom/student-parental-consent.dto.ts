import { ISchool } from '../school';
import { IStudentParentalConsentType } from '../student-parental-consent-type';

export interface IStudentParentalConsentDTO {
    Id: number;
    LastName: string;
    FirstName: string;
    DateOfBirth: Date;
    StudentCode: string;
    School: ISchool;
    Grade: string;
    Consent: IStudentParentalConsentType;
    TotalBillableClaims: number;
    EffectiveDate: Date;
}
