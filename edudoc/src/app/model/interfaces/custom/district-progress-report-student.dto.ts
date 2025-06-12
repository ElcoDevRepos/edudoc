import { IProgressReport } from '../progress-report';

export interface IDistrictProgressReportStudentDto {
    ProviderId: number,
    StudentId: number,
    FirstName: string,
    LastName: string,
    TotalEncounters: number,
    ProgressReports: IProgressReport[],
}
