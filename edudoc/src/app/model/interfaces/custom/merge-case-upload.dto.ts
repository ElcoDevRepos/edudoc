import { IProviderCaseUpload } from '../provider-case-upload';
import { IStudent } from '../student';

export interface IMergeCaseUploadDTO {
    CaseUpload: IProviderCaseUpload;
    Student: IStudent;
    StudentIds: number[];
    ParentalConsentTypeId?: number;
    ParentalConsentEffectiveDate?: Date;
}
