import { IESignatureContent } from '../e-signature-content';
import { IProgressReport } from '../progress-report';
import { IUser } from '../user';

export interface IProviderCaseLoadDTO {
    Id: number;
    LastName: string;
    FirstName: string;
    StudentCode: string;
    DateOfBirth: Date;
    School: string;
    SchoolDistrict: string;
    ESC: string;
    SortingName: string[];
    ProgressReports: IProgressReport[];
    Assistants: IUser[];
    Supervisor: string;
    EffectiveStartDate: Date;
    NeedsReferral: boolean;
    LatestReferralId: number;
    IsBillable: boolean;
    CanBeArchived: boolean;
    HasIncompleteProfile: boolean;
    IsAssistantCaseload: boolean;
    ReferralSignature: IESignatureContent[];
}
